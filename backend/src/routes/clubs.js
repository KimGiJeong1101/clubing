const express = require('express');
const Club = require('../models/Club');
const Meeting = require('../models/Meeting');
const sessionAuth = require('../middleware/sessionAuth');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path'); // path 모듈을 불러옵니다.
const fs = require('fs');
const Gallery = require('../models/ClubGallery');

//리스트 보여주기
router.get("/", async (req, res, next) => {
  try {
    console.log("여긴");
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

//클럽 만들기(POST)
router.post("/create", sessionAuth, async (req, res, next) => {
  try {
    //region 서울시 동작구 노량진동 이런거 띄어쓰기 단위로 잘라서 객체화 !!
    req.body.admin = req.user.email; // 방장 적용
    let a = [];
    a.push(req.user.email);
    req.body.members = a;
    //서브카테고리 나누기
    let subCategory = req.body.subCategory.split("/");
    req.body.subCategory = subCategory;
    //서브카테고리 나누기.end

    const club = new Club(req.body);
    await club.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

//클럽 보여주기(GET)
router.get("/read/:id", async (req, res, next) => {
  try {
    console.log("여긴22");
    console.log(req.params.id);
    const clubs = await Club.findById({ _id: req.params.id });
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

//클럽 보여주기(수정 , GET)

router.get("/read2/:id", async (req, res, next) => {
  try {
    console.log("여긴232");
    console.log(req.params.id);
    const clubs = await Club.findById({ _id: req.params.id });
    const meetings = await Meeting.find({ clubNumber: req.params.id });
    console.log(meetings);
    clubs.meeting = meetings;
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const clubs = await Club.findByIdAndDelete({ _id: req.params.id });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});


router.post("/update/:clubNumber", async (req, res, next) => {
  try {
    //서브카테고리 나누기
    let subCategory = req.body.subCategory.toString().split(",");
    //서브카테고리 나누기.end
    console.log(req.body);
    req.body.subCategory = subCategory;
    const updatedClub = await Club.findByIdAndUpdate(
      req.params.clubNumber,
      req.body,
      { new: true } // 업데이트 후 새 객체를 반환
    );
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/addMember/:clubNumber", sessionAuth, async (req, res, next) => {
  try {
    console.log("addMeber/:clubNumber 도착");
    
    console.log(req.body);
    console.log(req.user.email);
    const clubs = await Club.findById({ _id: req.params.clubNumber });
    clubs.members.push(req.user.email);
    console.log(clubs);
    clubs.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});


/**===========================================================gallery============================================================= */
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
// 클럽별 갤러리 이미지 등록
router.post('/:clubNumber/gallery/images', upload, async (req, res, next) => {
  try {
      const { originPath, thumbnailPath } = createDailyFolder();
      const files = req.files;
      const { clubNumber } = req.params;
      const { writer, title, content } = req.body;

      console.log("클럽 번호:", clubNumber);  // 디버깅용 로그
      console.log("작성자:", writer);         // 디버깅용 로그
      console.log("파일 개수:", files.length);  // 디버깅용 로그

      let originImages = [];
      let thumbnailImages = [];

      // 이미지 처리
      for (const file of files) {
          const originalFilePath = path.join(originPath, file.filename);
          const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${file.filename}`);

          await sharp(originalFilePath).resize(400).toFile(thumbnailFilePath);

          originImages.push(originalFilePath);
          thumbnailImages.push(thumbnailFilePath);
      }

      // 새로운 갤러리 항목 생성
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
      console.error("에러 발생:", error.message);  // 에러 메시지를 콘솔에 출력
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

// 클럽별 이미지 삭제 라우트
router.delete('/:clubNumber/gallery/images', async (req, res) => {
  const { imageIds } = req.body;
  const { clubNumber } = req.params;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ error: 'No image IDs provided or invalid format' });
  }

  try {
      const galleriesToDelete = await Gallery.find({ _id: { $in: imageIds }, clubNumber });

      galleriesToDelete.forEach(gallery => {
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

      await Gallery.deleteMany({ _id: { $in: imageIds }, clubNumber });

      res.json({ success: true, deletedCount: galleriesToDelete.length });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// 클럽별 전체 이미지 삭제 라우트
router.delete('/:clubNumber/gallery/images/all', async (req, res) => {
  const { clubNumber } = req.params;

  try {
      const galleries = await Gallery.find({ clubNumber });

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

      const deleteResult = await Gallery.deleteMany({ clubNumber });
      res.json({ success: true, deletedCount: galleries.length });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// 클럽별 이미지 수정 라우트
router.put('/:clubNumber/gallery/images/:id', (req, res, next) => {
  upload(req, res, async err => {
      if (err) {
          return res.status(500).send(err);
      }

      const { originPath, thumbnailPath } = createDailyFolder();
      const files = req.files;
      const { clubNumber, id } = req.params;

      try {
          const gallery = await Gallery.findOne({ _id: id, clubNumber });

          let originImages = [...gallery.origin_images];
          let thumbnailImages = [...gallery.thumbnail_images];

          if (files && files.length > 0) {
              originImages = [];
              thumbnailImages = [];

              for (const file of files) {
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
          res.status(500).send(error.message);
      }
  });
});

/**===========================================================gallery============================================================= */
module.exports = router;
