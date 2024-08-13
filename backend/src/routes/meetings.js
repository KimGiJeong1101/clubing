const express = require("express");
const Meeting = require("../models/Meeting");
const sessionAuth = require("../middleware/sessionAuth");
const router = express.Router();

//클럽 만들기(POST)

//리스트 보여주기
router.get('/:clubNumber', async (req, res, next) => {
    try {
        console.log('meeting list 보여주는 곳');    
        const meetings = await Meeting.find({clubNumber : req.params.clubNumber});
        console.log(meetings);

        res.json(meetings);
    } catch (error) {
        next(error)
    }
})

router.post("/create", sessionAuth, async (req, res, next) => {
  try {
    // Meeting 인스턴스 생성
    const meeting = new Meeting(req.body);
    await meeting.save();
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/join/:meetingId", sessionAuth, async (req, res, next) => {
  try {
    const meetingId = req.params.meetingId;
    const meeting = await Meeting.findById(meetingId);
    if(!meeting.joinMember){
        meeting.joinMember = [];
    }
    //멤버 중 내가 이미 참가했었나
    for(let i = 0 ; i<meeting.joinMember.length ; i++){
        if(meeting.joinMember[i] == req.user.email){
            meeting.joinMember.splice(i, 1); 
            await meeting.save();
            return res.status(200).json({ message: '참석 취소' });
        }
    }
    meeting.joinMember.push(req.user.email);
    await meeting.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndDelete({ _id: req.params.id });
    if (meeting) {
      return res.sendStatus(200).json(true);
    } else {
      return res.sendStatus(404).json(false);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
