const express = require("express");
const Club = require("../models/Club");
const Meeting = require("../models/Meeting");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path"); // path 모듈을 불러옵니다.
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // uuid v4 방식 사용
const User = require("../models/User");

//리스트 보여주기
router.get("/", async (req, res, next) => {
  try {
    const clubs = await Club.find().sort({ _id: 1 }); // 오름차순 솔팅
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

router.get("/scroll", async (req, res, next) => {
  try {
    const clubs = await Club.find().sort({ _id: 1 }); // 오름차순 솔팅
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

router.use("/clubs", express.static(path.join(__dirname, "clubs")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "clubs/";

    // 폴더가 존재하지 않으면 생성
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + "-" + Date.now(); // UUID와 현재 시간 조합
    const fileExtension = path.extname(file.originalname); // 원본 파일 확장자 가져오기
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`); // 필드명-UUID-시간.확장자
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post("/create", sessionAuth, upload.single("img"), async (req, res, next) => {
  try {
    req.body.img = req.file.destination + req.file.filename;
    req.body.admin = req.user.email;
    req.body.adminNickName = req.user.nickName;
    req.body.members = [req.user.email];

    if (req.body.subCategory) {
      req.body.subCategory = req.body.subCategory.split(",");
    }

    // 클럽 생성
    const club = new Club(req.body);
    await club.save();

    res.status(200).json({ message: "클럽 생성 완료" });
  } catch (error) {
    next(error);
  }
});

//클럽 보여주기(GET)
router.get("/read/:id", async (req, res, next) => {
  try {
    const clubs = await Club.findById({ _id: req.params.id });
    res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
});

//클럽 보여주기(수정 , GET)

router.get("/read2/:id", async (req, res, next) => {
  try {
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

router.post("/update/:clubNumber",sessionAuth,upload.single("img"), async (req, res, next) => {
  try {
    //서브카테고리 나누기
    //서브카테고리 나누기.end
    console.log(`req.body`);
    console.log(req.body);
    console.log(`req.body`);

    req.body.img = req.file.destination + req.file.filename;

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.clubNumber,
      req.body,
      { new: true }, // 업데이트 후 새 객체를 반환
    );
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/addMember/:clubNumber", auth, async (req, res, next) => {
  try {
    console.log("addMeber/:clubNumber 도착");
    const clubs = await Club.findById({ _id: req.params.clubNumber });
    clubs.members.push(req.user.email);
    console.log(clubs);
    clubs.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/cencellMember/:clubNumber", sessionAuth, async (req, res, next) => {
  try {
    const clubs = await Club.findById({ _id: req.params.clubNumber });
    const memberIndex = clubs.members.indexOf(req.user.email);
    clubs.members.splice(memberIndex, 1);
    clubs.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

//카테고리로 같이 연관된 모임 추천해주려고
router.get("/category/:category", async (req, res, next) => {
  try {
    const categoryClubList = await Club.find({
      mainCategory: req.params.category,
    });
    return res.status(200).json(categoryClubList);
  } catch (error) {
    next(error);
  }
});
router.post("/membersInfo", async (req, res, next) => {
  try {
    const memberInfo = [];
    for (let i = 0; i < req.body.length; i++) {
      let copymember = { thumbnailImage: "", name: "", nickName: "" };
      console.log(req.body[i]);
      const userinfo = await User.findOne({ email: req.body[i] });
      copymember.name = userinfo.name;
      copymember.nickName = userinfo.nickName;
      copymember.thumbnailImage = userinfo.profilePic.thumbnailImage;
      memberInfo.push(copymember);
    }
    return res.status(200).json(memberInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
