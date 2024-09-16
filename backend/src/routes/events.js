const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Board = require("../models/ClubBoard");
const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mime = require("mime-types");
const { v4: uuid } = require("uuid");
const User = require("../models/User");

// Upload directory
const uploadDir = path.join(__dirname, "../../upload");

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dateFolder = getFormattedDate();
    const fullPath = path.join(uploadDir, dateFolder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

// Routes
router.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file);
});

router.get("/image/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

router.post("/newEvent", async (req, res) => {
  const { writer, title, content } = req.body;

  console.log("writer (email):", writer); // writer가 이메일인지 확인

  try {
    // writer의 이메일로 사용자 조회
    const user = await User.findOne({ email: writer }); // 이메일로 사용자 찾기

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const roleNumber = user.roles;

    if (roleNumber !== 0) {
      return res.status(403).json({ error: "관리자만 이용할 수 있습니다." });
    }

    if (!title || !content) {
      return res.status(400).send("제목과 내용을 입력해주세요.");
    }

    const newBoard = new Event({ writer: user._id, title, content }); // writer에 사용자 ObjectId 저장
    await newBoard.save();
    console.log("글등록성공"); // 콘솔에 성공 메시지 출력
    res.status(200).send("Content received and saved");
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).send("Failed to save content");
  }
});

module.exports = router;
