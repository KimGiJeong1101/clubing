const express = require('express');
const Club = require('../models/Club');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path'); // path 모듈을 불러옵니다.
const fs = require('fs');
const Gallery = require('../models/ClubGallery');



// 날짜별 폴더 생성 함수 (갤러리용)
const createDailyFolder = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const folderPath = path.join('uploads', `${year}-${month}-${day}`);

  if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
  }

  const originPath = path.join(folderPath, 'origin_img');
  const thumbnailPath = path.join(folderPath, 'thumbnail_img');

  if (!fs.existsSync(originPath)) {
      fs.mkdirSync(originPath);
  }

  if (!fs.existsSync(thumbnailPath)) {
      fs.mkdirSync(thumbnailPath);
  }

  return { originPath, thumbnailPath };
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const { originPath } = createDailyFolder();
      cb(null, originPath);
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage }).array('files', 8);


// 클럽별 갤러리 이미지 등록
router.post('/:clubNumber/gallery/images', upload, async (req, res, next) => {
  try {
      const { originPath, thumbnailPath } = createDailyFolder();
      const files = req.files;
      const { clubNumber } = req.params;
      const { writer, title, content } = req.body;

      console.log("클럽 번호:", clubNumber);
      console.log("작성자:", writer);
      console.log("파일 개수:", files.length);

      // 클럽 확인
      const club = await Club.findById(clubNumber);
      if (!club) {
        return res.status(404).json({ error: '클럽을 찾을 수 없습니다.' });
      }

      // 멤버 확인
      if (!club.members.includes(writer)) {
        return res.status(403).json({ error: '이 클럽의 멤버가 아닙니다.' });
      }

      let originImages = [];
      let thumbnailImages = [];

      // 이미지 처리
      for (const file of files) {
          const originalFilePath = path.join(originPath, file.filename);
          const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${file.filename}`);

          // 이미지 리사이징
          await sharp(originalFilePath).resize(400).toFile(thumbnailFilePath);

          originImages.push(originalFilePath);
          thumbnailImages.push(thumbnailFilePath);
      }

      // 갤러리 생성
      const gallery = new Gallery({
          clubNumber,
          writer,
          title,
          content,
          origin_images: originImages,
          thumbnail_images: thumbnailImages,
          likes: 0,
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date()
      });

      await gallery.save();
      return res.json({ success: true, gallery });
  } catch (error) {
      console.error("에러 발생:", error.message);
      return res.status(500).json({ error: error.message });
  }
});




// 클럽별 이미지 리스트 반환 라우트
router.get('/:clubNumber/gallery/images', async (req, res) => {
  try {
      const { clubNumber } = req.params;  // 클럽 번호를 가져옴
      const galleries = await Gallery.find({ clubNumber });  // 해당 클럽 번호에 속하는 갤러리만 조회

      res.json(galleries.map(gallery => ({
          _id: gallery._id,
          originalImage: `http://localhost:4000/${gallery.origin_images[0]}`,
          thumbnailImage: `http://localhost:4000/${gallery.thumbnail_images[0]}`,
          allImages: gallery.origin_images.map(img => `http://localhost:4000/${img}`),
          title: gallery.title,
          content: gallery.content
      })));
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// 클럽별 이미지 상세 정보 가져오기 라우트
router.get('/:clubNumber/gallery/images/:id', async (req, res) => {
  try {
      const { clubNumber } = req.params;
      const gallery = await Gallery.findOne({ _id: req.params.id, clubNumber });

      if (!gallery) {
          return res.status(404).json({ error: 'Gallery not found' });
      }

      res.json({
          _id: gallery._id,
          originImages: gallery.origin_images.map(img => `http://localhost:4000/${img}`),
          title: gallery.title,
          content: gallery.content,
          views: gallery.views,
          likes: gallery.likes
      });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// 클럽별 이미지 선택삭제 라우트 (글 작성자와 관리자만 삭제 가능)
router.delete('/:clubNumber/gallery/images', async (req, res) => {
  const { imageIds, writer } = req.body;
  const { clubNumber } = req.params;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    return res.status(400).json({ error: '삭제할 이미지를 선택 후에 선택삭제를 눌러주세요' });
  }

  try {
    const galleriesToDelete = await Gallery.find({ _id: { $in: imageIds }, clubNumber });

    if (galleriesToDelete.length === 0) {
      return res.status(404).json({ error: 'Images not found.' });
    }

    const club = await Club.findById(clubNumber);
    if (!club) {
      return res.status(404).json({ error: '클럽을 찾을 수 없습니다.' });
    }

    const isAdmin = club.admin === writer;

    // `for` 루프를 사용하여 삭제 권한을 확인합니다.
    for (const gallery of galleriesToDelete) {
      if (!isAdmin && gallery.writer !== writer) {
        return res.status(403).json({ error: '삭제 권한이 없습니다.' });
      }
    }

    // 실제 이미지 파일을 삭제하는 부분
    for (const gallery of galleriesToDelete) {
      for (const filePath of gallery.origin_images) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      for (const filePath of gallery.thumbnail_images) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Gallery.deleteMany({ _id: { $in: imageIds }, clubNumber });

    // 성공적으로 처리되었을 때 응답을 보냄
    return res.json({ success: true, deletedCount: galleriesToDelete.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});






// 클럽별 전체 이미지 삭제 라우트
router.delete('/:clubNumber/gallery/images/all', async (req, res) => {
  const { clubNumber } = req.params;
  const { writer } = req.body;

  try {
      // 클럽 정보 조회
      const club = await Club.findById(clubNumber);
      
      if (!club) {
          return res.status(404).json({ error: '클럽을 찾을 수 없습니다.' });
      }

      // 클럽장인지 확인
      if (club.admin !== writer) {
          return res.status(403).json({ error: '전체 삭제는 클럽장만 사용할 수 있습니다.' });
      }

      const galleries = await Gallery.find({ clubNumber });

      // 이미지 파일 삭제
      galleries.forEach(gallery => {
          gallery.origin_images.forEach(filePath => {
              if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
              }
          });
          gallery.thumbnail_images.forEach(filePath => {
              if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
              }
          });
      });

      // 갤러리 데이터 삭제
      await Gallery.deleteMany({ clubNumber });
      
      res.json({ success: true, deletedCount: galleries.length });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



// 클럽별 이미지 수정 라우트 (글 작성자와 관리자만 수정 가능)
router.put('/:clubNumber/gallery/images/:id', upload, async (req, res, next) => {
  try {
    const { clubNumber, id } = req.params;
    const { writer } = req.body; // 요청한 사용자의 이메일

    const gallery = await Gallery.findOne({ _id: id, clubNumber });
    const club = await Club.findById(clubNumber);

    // 클럽과 갤러리가 존재하는지 확인
    if (!gallery || !club) {
      return res.status(404).json({ error: '클럽 또는 갤러리를 찾을 수 없습니다.' });
    }

    // 권한 확인: 글 작성자 또는 관리자만 수정 가능
    if (gallery.writer !== writer && club.admin !== writer) {
      return res.status(403).json({ error: '수정할 권한이 없습니다.' });
    }

    // 이미지 처리
    let originImages = [...gallery.origin_images];
    let thumbnailImages = [...gallery.thumbnail_images];
    if (req.files && req.files.length > 0) {
      const { originPath, thumbnailPath } = createDailyFolder();
      originImages = [];
      thumbnailImages = [];

      for (const file of req.files) {
        const originalFilePath = path.join(originPath, file.filename);
        const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${file.filename}`);

        await sharp(originalFilePath).resize(400).toFile(thumbnailFilePath);

        originImages.push(originalFilePath);
        thumbnailImages.push(thumbnailFilePath);
      }
    }

    // 업데이트 항목 처리
    gallery.title = req.body.title;
    gallery.content = req.body.content;
    gallery.origin_images = originImages;
    gallery.thumbnail_images = thumbnailImages;
    gallery.updatedAt = new Date();  // 업데이트 시간 갱신

    await gallery.save();
    res.json({ success: true, gallery });
  } catch (error) {
    console.error("에러 발생:", error.message);
    res.status(500).json({ error: error.message });
  }
});












module.exports = router;
