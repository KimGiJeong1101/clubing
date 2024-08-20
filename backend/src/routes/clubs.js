const express = require("express");
const Club = require("../models/Club");
const Meeting = require("../models/Meeting");
const sessionAuth = require("../middleware/sessionAuth");
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
    const clubs = await Club.find().sort({ _id: 1 }); // 오름차순 솔팅
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
    req.body.adminNickName = req.user.nickName; //방장 닉네임 추가
    let a = [];
    a.push(req.user.email);
    req.body.members = a;
    //서브카테고리 나누기
    let subCategory = req.body.subCategory.split(",");
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

router.post(
  "/cencellMember/:clubNumber",
  sessionAuth,
  async (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.user.email);
      console.log(req.user.email);
      const clubs = await Club.findById({ _id: req.params.clubNumber });
      const memberIndex = clubs.members.indexOf(req.user.email);
      clubs.members.splice(memberIndex, 1);
      console.log(clubs.members);
      clubs.save();
      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/category/:category", async (req, res, next) => {
  try {
    const categoryClubList = await Club.find({
      mainCategory: req.params.category,
    });
    console.log("categoryClubList");
    console.log(categoryClubList);
    console.log("categoryClubList");
    return res.status(200).json(categoryClubList);
  } catch (error) {
    next(error);
  }
});

/**===========================================================gallery============================================================= */
// 날짜별 폴더 생성 함수 (갤러리용)



/**===========================================================gallery============================================================= */
module.exports = router;
