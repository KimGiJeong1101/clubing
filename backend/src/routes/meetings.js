const express = require("express");
const Meeting = require("../models/Meeting");
const sessionAuth = require("../middleware/sessionAuth");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // path 모듈을 불러옵니다.
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // uuid v4 방식 사용

router.use("/meetings", express.static(path.join(__dirname, "meetings")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "meetings/";

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

//리스트 보여주기
router.get('/:clubNumber', async (req, res, next) => {
    try {
        const meetings = await Meeting.find({clubNumber : req.params.clubNumber});

        res.json(meetings);
    } catch (error) {
        next(error)
    }
})

router.post("/create", sessionAuth, upload.single("img"), async (req, res, next) => {
  try {
    // Meeting 인스턴스 생성
    const meeting = new Meeting(req.body);
    meeting.img = req.file.destination + req.file.filename;
    const copy = meeting.dateTime.split(" ");
    const time = copy[4].split(':');
    let dayOfWeek = "";
    let month = "";
    //요일 변환
    switch (copy[0]) {
      case "Sun":
        dayOfWeek = "(일)";
        break;
      case "Mon":
        dayOfWeek = "(월)";
        break;
      case "Tue":
        dayOfWeek = "(화)";
        break;
      case "Wed":
        dayOfWeek = "(수)";
        break;
      case "Thu":
        dayOfWeek = "(목)";
        break;
      case "Fri":
        dayOfWeek = "(금)";
        break;
      case "Sat":
        dayOfWeek = "(토)";
        break;
      default:
        dayOfWeek = "알 수 없는 요일";
    }
    // 월 변환
    switch (copy[1]) {
      case "Jan":
        month = "1월";
        break;
      case "Feb":
        month = "2월";
        break;
      case "Mar":
        month = "3월";
        break;
      case "Apr":
        month = "4월";
        break;
      case "May":
        month = "5월";
        break;
      case "Jun":
        month = "6월";
        break;
      case "Jul":
        month = "7월";
        break;
      case "Aug":
        month = "8월";
        break;
      case "Sep":
        month = "9월";
        break;
      case "Oct":
        month = "10월";
        break;
      case "Nov":
        month = "11월";
        break;
      case "Dec":
        month = "12월";
        break;
      default:
        month = "알 수 없는 월";
    }
    
    const realDateTime = `${copy[3]}년 ${month} ${copy[2]}일 ${dayOfWeek} ${time[0]}:${time[1]}`;
    meeting.dateTime = realDateTime;
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
