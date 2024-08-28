const express = require("express");
const Club = require("../models/Club");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/ClubGallery");
// 날짜별 폴더 생성 함수 (갤러리용)
const createDailyFolder = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const folderPath = path.join("uploads", `${year}-${month}-${day}`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const originPath = path.join(folderPath, "origin_img");
  const thumbnailPath = path.join(folderPath, "thumbnail_img");

  if (!fs.existsSync(originPath)) {
    fs.mkdirSync(originPath);
  }

  if (!fs.existsSync(thumbnailPath)) {
    fs.mkdirSync(thumbnailPath);
  }

  return { originPath, thumbnailPath };
};

// 파일 이름이 중복될 경우 "(1)", "(2)" 숫자를 추가해 고유하게 만드는 함수
const generateUniqueFilename = (directory, filename) => {
  const ext = path.extname(filename); // 확장자 추출
  const base = path.basename(filename, ext); // 확장자를 제외한 파일명
  let uniqueFilename = filename;
  let counter = 1;

  while (fs.existsSync(path.join(directory, uniqueFilename))) {
    uniqueFilename = `${base}(${counter})${ext}`;
    counter++;
  }

  return uniqueFilename;
};

// Multer storage 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { originPath } = createDailyFolder();
    cb(null, originPath);
  },
  filename: function (req, file, cb) {
    const { originPath } = createDailyFolder();
    const uniqueFilename = generateUniqueFilename(
      originPath,
      file.originalname
    );
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage }).array("files", 8);
// 클럽별 갤러리 이미지 등록
router.post("/:clubNumber/images", upload, async (req, res) => {
  try {
    const { originPath, thumbnailPath } = createDailyFolder();
    const files = req.files;
    const { clubNumber } = req.params;
    const { writer, title, content } = req.body;

    const club = await Club.findById(clubNumber);
    if (!club) {
      return res.status(404).json({ error: "클럽을 찾을 수 없습니다." });
    }

    if (!club.members.includes(writer)) {
      return res.status(403).json({ error: "이 클럽의 멤버가 아닙니다." });
    }

    let originImages = [];
    let thumbnailImages = [];

    // 이미지 처리
    for (const file of files) {
      const originalFilePath = path.join(originPath, file.filename);
      const thumbnailFilePath = path.join(
        thumbnailPath,
        `thumbnail_${file.filename}`
      );

      // 이미지 리사이징
      await sharp(file.path).resize(400).toFile(thumbnailFilePath);

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
      thumbnail_images: thumbnailImages, // 썸네일 경로 포함해서 저장
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await gallery.save();
    return res.json({ success: true, gallery });
  } catch (error) {
    console.error("에러 발생:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// 클럽별 이미지 수정 라우트
router.put("/:clubNumber/images/:id", upload, async (req, res) => {
  try {
    const { clubNumber, id } = req.params;
    const { writer, title, content, sortedImages } = req.body;

    const gallery = await Gallery.findOne({ _id: id, clubNumber });
    const club = await Club.findById(clubNumber);

    if (!gallery || !club) {
      return res
        .status(404)
        .json({ error: "클럽 또는 갤러리를 찾을 수 없습니다." });
    }

    if (gallery.writer !== writer && club.admin !== writer) {
      return res.status(403).json({ error: "수정할 권한이 없습니다." });
    }

    let newOriginImages = [];
    let newThumbnailImages = [];

    // sortedImages에서 기존 파일의 순서만 변경하고 이름은 유지
    if (sortedImages) {
      const parsedImages = JSON.parse(sortedImages);

      // 기존 파일명을 그대로 사용하여 경로의 "http://localhost:4000/" 부분을 제거하고 시스템에 맞게 변환
      newOriginImages = parsedImages.map((img) => {
        // "http://localhost:4000/" 제거
        const relativeUrl = img.url.replace("http://localhost:4000/", "");
        // 시스템 경로로 변환
        return relativeUrl.replace(/\//g, path.sep);
      });

      newThumbnailImages = parsedImages.map((img) => {
        // "http://localhost:4000/" 제거 및 썸네일 경로로 변경
        const relativeUrl = img.url.replace("http://localhost:4000/", "");
        // 경로를 thumbnail_img로 변환하고 시스템 경로로 변환, 그리고 썸네일 이름에 thumbnail_ 추가
        return relativeUrl
          .replace("origin_img", "thumbnail_img")
          .replace(/(\/|\\)([^/\\]+)$/, `$1thumbnail_$2`)
          .replace(/\//g, path.sep);
      });
    }

    // 새로 업로드된 파일 처리
    if (req.files && req.files.length > 0) {
      const { originPath, thumbnailPath } = createDailyFolder();

      for (const file of req.files) {
        const originalFilePath = path.join(originPath, file.filename);
        const thumbnailFilePath = path.join(
          thumbnailPath,
          `thumbnail_${file.filename}`
        );

        // 이미지 리사이징 및 저장
        await sharp(file.path).resize(400).toFile(thumbnailFilePath);

        // 새로 추가된 파일을 기존 이미지 리스트에 추가
        newOriginImages.push(originalFilePath);
        newThumbnailImages.push(thumbnailFilePath);
      }
    }

    // 갤러리 데이터 업데이트
    gallery.origin_images = newOriginImages;
    gallery.thumbnail_images = newThumbnailImages; // 썸네일 경로 포함해서 저장
    gallery.title = title;
    gallery.content = content;
    gallery.updatedAt = new Date();

    await gallery.save();
    return res.json({ success: true, gallery });
  } catch (error) {
    console.error("에러 발생:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 클럽별 이미지 리스트 반환 라우트
router.get("/:clubNumber/images", async (req, res) => {
  try {
    const { clubNumber } = req.params;
    const galleries = await Gallery.find({ clubNumber });

    res.json(
      galleries.map((gallery) => ({
        _id: gallery._id,
        originalImage: `http://localhost:4000/${gallery.origin_images[0]}`,
        thumbnailImage: `http://localhost:4000/${gallery.thumbnail_images[0]}`,
        allImages: gallery.origin_images.map(
          (img) => `http://localhost:4000/${img}`
        ),
        title: gallery.title,
        content: gallery.content,
      }))
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 클럽별 이미지 상세 정보 가져오기 라우트
router.get("/:clubNumber/images/:id", async (req, res) => {
  try {
    const { clubNumber } = req.params;
    const gallery = await Gallery.findOne({ _id: req.params.id, clubNumber });

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.json({
      _id: gallery._id,
      originImages: gallery.origin_images.map(
        (img) => `http://localhost:4000/${img}`
      ),
      title: gallery.title,
      content: gallery.content,
      views: gallery.views,
      likes: gallery.likes,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 클럽별 이미지 삭제 라우트
router.delete("/:clubNumber/images", async (req, res) => {
  const { imageIds, writer } = req.body;
  const { clubNumber } = req.params;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    return res
      .status(400)
      .json({ error: "삭제할 이미지를 선택 후에 선택삭제를 눌러주세요" });
  }

  try {
    const galleriesToDelete = await Gallery.find({
      _id: { $in: imageIds },
      clubNumber,
    });

    if (galleriesToDelete.length === 0) {
      return res.status(404).json({ error: "Images not found." });
    }

    const club = await Club.findById(clubNumber);
    if (!club) {
      return res.status(404).json({ error: "클럽을 찾을 수 없습니다." });
    }

    const isAdmin = club.admin === writer;

    for (const gallery of galleriesToDelete) {
      if (!isAdmin && gallery.writer !== writer) {
        return res.status(403).json({ error: "삭제 권한이 없습니다." });
      }
    }

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

    return res.json({ success: true, deletedCount: galleriesToDelete.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 클럽별 전체 이미지 삭제 라우트
router.delete("/:clubNumber/images/all", async (req, res) => {
  const { clubNumber } = req.params;
  const { writer } = req.body;

  try {
    // 클럽 정보 조회
    const club = await Club.findById(clubNumber);

    if (!club) {
      return res.status(404).json({ error: "클럽을 찾을 수 없습니다." });
    }

    // 클럽장인지 확인
    if (club.admin !== writer) {
      return res
        .status(403)
        .json({ error: "전체 삭제는 클럽장만 사용할 수 있습니다." });
    }

    const galleries = await Gallery.find({ clubNumber });

    // 이미지 파일 삭제
    galleries.forEach((gallery) => {
      gallery.origin_images.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      gallery.thumbnail_images.forEach((filePath) => {
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

module.exports = router;
