const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Board = require("../models/ClubBoard");
const Club = require("../models/Club");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mime = require("mime-types");
const { v4: uuid } = require("uuid");


// Upload directory
const uploadDir = path.join(__dirname, '../../upload');

function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
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
        if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

// Routes
router.post('/upload',upload.single('file'), (req, res) => {
    res.status(200).json(req.file);
});

router.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});






module.exports = router;
