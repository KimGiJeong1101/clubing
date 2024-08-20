const express = require('express');
const router = express.Router({ mergeParams: true });  // 부모 라우터에서 파라미터를 가져오도록 설정

// /**===========================================================gallery============================================================= */
// // 날짜별 폴더 생성 함수 (갤러리용)
// const createDailyFolder = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     const folderPath = path.join('uploads', `${year}-${month}-${day}`);
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }
//     const originPath = path.join(folderPath, 'origin_img');
//     const thumbnailPath = path.join(folderPath, 'thumbnail_img');
//     if (!fs.existsSync(originPath)) {
//         fs.mkdirSync(originPath);
//     }
//     if (!fs.existsSync(thumbnailPath)) {
//         fs.mkdirSync(thumbnailPath);
//     }
//     return { originPath, thumbnailPath };
//   };
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const { originPath } = createDailyFolder();
//         cb(null, originPath);
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }
//   });
//   const upload = multer({ storage: storage }).array('files', 8);
//   // 클럽별 갤러리 이미지 등록
//   router.post('/:clubNumber/gallery/images', (req, res, next) => {
//     upload(req, res, async err => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         const { originPath, thumbnailPath } = createDailyFolder();
//         const files = req.files;
//         const { clubNumber } = req.params;  // 클럽 번호를 가져옴
//         try {
//             let originImages = [];
//             let thumbnailImages = [];
//             for (const file of files) {
//                 const originalFilePath = path.join(originPath, file.filename);
//                 const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${file.filename}`);
//                 await sharp(originalFilePath).resize(400).toFile(thumbnailFilePath);
//                 originImages.push(originalFilePath);
//                 thumbnailImages.push(thumbnailFilePath);
//             }
//             // 새로운 갤러리 항목 생성 (작성자 추가)
//             const gallery = new Gallery({
//                 clubNumber,  // 클럽 번호 저장
//                 writer: req.user._id,  // 세션에서 가져온 유저 정보로 작성자 설정
//                 title: req.body.title,
//                 content: req.body.content,
//                 origin_images: originImages,
//                 thumbnail_images: thumbnailImages,
//                 likes: 0,
//                 views: 0,
//                 createdAt: new Date(),  // 생성일 설정
//                 updatedAt: new Date()   // 업데이트일 설정
//             });
//             await gallery.save();
//             res.json({ success: true, gallery });
//         } catch (error) {
//             res.status(500).send(error.message);
//         }
//     });
//   });
//   // 클럽별 이미지 리스트 반환 라우트
//   router.get('/:clubNumber/gallery/images', async (req, res) => {
//     try {
//         const { clubNumber } = req.params;  // 클럽 번호를 가져옴
//         const galleries = await Gallery.find({ clubNumber });  // 해당 클럽 번호에 속하는 갤러리만 조회
//         res.json(galleries.map(gallery => ({
//             _id: gallery._id,
//             originalImage: `http://localhost:4000/${gallery.origin_images[0]}`,
//             thumbnailImage: `http://localhost:4000/${gallery.thumbnail_images[0]}`,
//             allImages: gallery.origin_images.map(img => `http://localhost:4000/${img}`),
//             title: gallery.title,
//             content: gallery.content
//         })));
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
//   });
//   // 클럽별 이미지 상세 정보 가져오기 라우트
//   router.get('/:clubNumber/gallery/images/:id', async (req, res) => {
//     try {
//         const { clubNumber } = req.params;
//         const gallery = await Gallery.findOne({ _id: req.params.id, clubNumber });
//         if (!gallery) {
//             return res.status(404).json({ error: 'Gallery not found' });
//         }
//         res.json({
//             _id: gallery._id,
//             originImages: gallery.origin_images.map(img => `http://localhost:4000/${img}`),
//             title: gallery.title,
//             content: gallery.content,
//             views: gallery.views,
//             likes: gallery.likes
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
//   });
//   // 클럽별 이미지 삭제 라우트
//   router.delete('/:clubNumber/gallery/images', async (req, res) => {
//     const { imageIds } = req.body;
//     const { clubNumber } = req.params;
//     if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
//         return res.status(400).json({ error: 'No image IDs provided or invalid format' });
//     }
//     try {
//         const galleriesToDelete = await Gallery.find({ _id: { $in: imageIds }, clubNumber });
//         galleriesToDelete.forEach(gallery => {
//             gallery.origin_images.forEach(filePath => {
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             });
//             gallery.thumbnail_images.forEach(filePath => {
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             });
//         });
//         await Gallery.deleteMany({ _id: { $in: imageIds }, clubNumber });
//         res.json({ success: true, deletedCount: galleriesToDelete.length });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
//   });
//   // 클럽별 전체 이미지 삭제 라우트
//   router.delete('/:clubNumber/gallery/images/all', async (req, res) => {
//     const { clubNumber } = req.params;
//     try {
//         const galleries = await Gallery.find({ clubNumber });
//         galleries.forEach(gallery => {
//             gallery.origin_images.forEach(filePath => {
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             });
//             gallery.thumbnail_images.forEach(filePath => {
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             });
//         });
//         const deleteResult = await Gallery.deleteMany({ clubNumber });
//         res.json({ success: true, deletedCount: galleries.length });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
//   });
//   // 클럽별 이미지 수정 라우트
//   router.put('/:clubNumber/gallery/images/:id', (req, res, next) => {
//     upload(req, res, async err => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         const { originPath, thumbnailPath } = createDailyFolder();
//         const files = req.files;
//         const { clubNumber, id } = req.params;
//         try {
//             const gallery = await Gallery.findOne({ _id: id, clubNumber });
//             let originImages = [...gallery.origin_images];
//             let thumbnailImages = [...gallery.thumbnail_images];
//             if (files && files.length > 0) {
//                 originImages = [];
//                 thumbnailImages = [];
//                 for (const file of files) {
//                     const originalFilePath = path.join(originPath, file.filename);
//                     const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${file.filename}`);
//                     await sharp(originalFilePath).resize(400).toFile(thumbnailFilePath);
//                     originImages.push(originalFilePath);
//                     thumbnailImages.push(thumbnailFilePath);
//                 }
//             }
//             // 업데이트 항목 처리
//             gallery.title = req.body.title;
//             gallery.content = req.body.content;
//             gallery.origin_images = originImages;
//             gallery.thumbnail_images = thumbnailImages;
//             gallery.updatedAt = new Date();  // 업데이트 시간 갱신
//             await gallery.save();
//             res.json({ success: true, gallery });
//         } catch (error) {
//             res.status(500).send(error.message);
//         }
//     });
//   });
//   /**===========================================================gallery============================================================= */
module.exports = router;