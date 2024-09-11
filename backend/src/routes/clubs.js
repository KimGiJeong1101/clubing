const express = require("express");
const Club = require("../models/Club");
const Meeting = require("../models/Meeting");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // path 모듈을 불러옵니다.
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // uuid v4 방식 사용
const User = require("../models/User");

//리스트 보여주기
router.get("/", async (req, res, next) => {
  try {
    if (req.query.searchRegion) {
      const clubs = await Club.find({ "region.district": req.query.searchRegion }).sort({ _id: -1 }).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    } else {
      const clubs = await Club.find().sort({ _id: -1 }).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    }
  } catch (error) {
    next(error);
  }
});
router.get("/:category", async (req, res, next) => {
  try {
    if (req.query.searchRegion) {
      const clubs = await Club.find({ mainCategory: req.params.category, "region.district": req.query.searchRegion }).sort({ _id: -1 }).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    } else {
      const clubs = await Club.find({ mainCategory: req.params.category }).sort({ _id: -1 }).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    }
  } catch (error) {
    next(error);
  }
});
router.get("/scroll/:scrollCount/:category", async (req, res, next) => {
  try {
    const skip = (req.params.scrollCount - 1) * 6;
    if (req.query.searchRegion) {
      const clubs = await Club.find({ mainCategory: req.params.category, "region.district": req.query.searchRegion }).sort({ _id: -1 }).skip(skip).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    } else {
      const clubs = await Club.find({ mainCategory: req.params.category }).sort({ _id: -1 }).skip(skip).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/scroll/:scrollCount", async (req, res, next) => {
  try {
    const skip = (req.params.scrollCount - 1) * 6;

    if (req.query.searchRegion) {
      const clubs = await Club.find({ "region.district": req.query.searchRegion }).sort({ _id: -1 }).skip(skip).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    } else {
      const clubs = await Club.find().sort({ _id: -1 }).skip(skip).limit(6); // 오름차순 솔팅
      res.status(200).json(clubs);
    }
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
router.post("/create", auth, upload.single("img"), async (req, res, next) => {
  try {
    const club2 = req.body;
    club2.admin = req.user.email;
    club2.img = req.file.destination + req.file.filename;
    club2.adminNickName = req.user.nickName;
    club2.members = [req.user.email];

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
    clubs.meeting = meetings;

    const memberInfo = [];
    for (let i = 0; i < clubs.members.length; i++) {
      let copymember = { thumbnailImage: "", name: "", nickName: "" };
      const userinfo = await User.findOne({ email: clubs.members[i] });
      copymember.name = userinfo.name;
      copymember.nickName = userinfo.nickName;
      copymember.thumbnailImage = userinfo.profilePic.thumbnailImage;
      memberInfo.push(copymember);
    }

    let copy = { ...clubs._doc, clubmembers: memberInfo };
    res.status(200).json(copy);
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

router.post("/update/:clubNumber", auth, upload.single("img"), async (req, res, next) => {
  try {
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

router.post("/update2/:clubNumber", auth, async (req, res, next) => {
  try {
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
    const clubs = await Club.findById({ _id: req.params.clubNumber });
    clubs.members.push(req.user.email);
    clubs.save();

    // 유저 정보에 클럽 ID 추가 (중복 방지) 9.9 hyk 추가
    await User.findOneAndUpdate(
      { email: req.user.email }, // 이메일로 유저를 찾음
      { $addToSet: { clubs: req.params.clubNumber } }, // 유저의 클럽 목록에 클럽 ID 추가
      { new: true }, // 업데이트된 문서를 반환하도록 설정
    );

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/cencellMember/:clubNumber", auth, async (req, res, next) => {
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
router.post("/deleteMember/:nickName/:clubNumber", async (req, res, next) => {
  try {
    let club = await Club.findById(req.params.clubNumber);
    const userinfo = await User.findOne({ nickName: req.params.nickName });

    const indexToRemove = club.members.indexOf(userinfo.email);
    console.log(`indexToRemove`);
    console.log(indexToRemove);
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
      club.members.splice(indexToRemove, 1);
      await club.save();
      return res.status(200).json("성공");
    } else {
      return res.status(500).json("실패");
    }
  } catch (error) {
    next(error);
  }
});
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//찜하기
router.post("/addWish/:clubNumber", auth, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const club = await Club.findById(req.params.clubNumber);
    if (!club) {
      return res.status(404).json({ error: "클럽을 찾을 수 없습니다." });
    }

    // 클럽의 찜한 유저 목록에 유저 이메일 추가
    await Club.findOneAndUpdate(
      { _id: req.params.clubNumber },
      { $addToSet: { wishHeart: req.user.email } }, // 유저 이메일 추가
      { new: true },
    );

    // 유저의 찜 목록에도 클럽 ID 추가
    await User.findOneAndUpdate({ email: req.user.email }, { $addToSet: { wish: req.params.clubNumber } }, { new: true });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

//찜하기 해제
router.post("/removeWish/:clubNumber", auth, async (req, res, next) => {
  console.log("클럽 번호:", req.params.clubNumber);
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const club = await Club.findById(req.params.clubNumber);
    if (!club) {
      return res.status(404).json({ error: "클럽을 찾을 수 없습니다." });
    }

    // 클럽의 찜한 유저 목록에서 유저 이메일 제거
    await Club.findOneAndUpdate({ _id: req.params.clubNumber }, { $pull: { wishHeart: req.user.email } }, { new: true });

    // 유저의 찜 목록에서도 클럽 ID 제거
    await User.findOneAndUpdate({ email: req.user.email }, { $pull: { wish: req.params.clubNumber } }, { new: true });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
