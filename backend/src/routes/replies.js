const express = require("express");
const Reply = require("../models/Reply");
const router = express.Router();
const moment = require("moment-timezone");
const User = require("../models/User");

// 댓글 등록 라우트
router.post("/add/:postId", async (req, res) => {
  try {
    const { postId } = req.params; // postId는 URL 파라미터에서 받음
    const { postType, writer, comment } = req.body; // 나머지는 req.body에서 받음
    console.log(req.body); // req.body를 확인
    console.log(req.params.postId); // req.params에서 postId를 확인
    if (!postId || !postType || !writer || !comment) {
      return res.status(400).json({ error: "모든 필드를 입력해주세요." });
    }

    // User 모델에서 작성자 정보 확인 (선택 사항, 필요시 사용)
    const user = await User.findOne({ nickName: writer });
    if (!user) {
      return res.status(404).json({ error: "작성자를 찾을 수 없습니다." });
    }

    const newReply = new Reply({
      postId,
      postType,
      writer,
      comment,
      createdAt: moment().tz("Asia/Seoul").toDate(),
    });

    await newReply.save();

    return res.status(201).json({ success: true, reply: newReply });
  } catch (error) {
    console.error("댓글 등록 중 에러 발생:", error.message);
    return res.status(500).json({ error: "서버 에러 발생." });
  }
});

// 특정 게시물의 모든 댓글을 불러오는 라우트
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const replies = await Reply.find({ postId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, replies });
  } catch (error) {
    console.error("댓글 불러오기 중 에러 발생:", error.message);
    return res.status(500).json({ error: "서버 에러 발생." });
  }
});

module.exports = router;
