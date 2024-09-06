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

    if (!postId || !postType || !writer || !comment) {
      return res.status(400).json({ error: "모든 필드를 입력해주세요." });
    }

    // User 모델에서 작성자 정보 확인 (닉네임으로 유저 찾기)
    const user = await User.findOne({ nickName: writer });
    if (!user) {
      return res.status(404).json({ error: "작성자를 찾을 수 없습니다." });
    }

    // writer 필드에 닉네임 대신 이메일 저장
    const newReply = new Reply({
      postId,
      postType,
      writer: user.email, // 이메일을 저장
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

    // 해당 postId의 모든 댓글을 최신순으로 불러옴
    const replies = await Reply.find({ postId }).sort({ createdAt: -1 });

    // 각 댓글의 writer(email)로 User 모델에서 닉네임을 찾아 변환
    const repliesWithNickNames = await Promise.all(
      replies.map(async (reply) => {
        // 이메일로 유저 정보 찾아오기
        const user = await User.findOne({ email: reply.writer });
        return {
          ...reply.toObject(), // 댓글 데이터를 객체로 변환
          writerNickName: user ? user.nickName : "Unknown", // 닉네임을 찾거나 없으면 Unknown으로 설정
        };
      })
    );

    return res
      .status(200)
      .json({ success: true, replies: repliesWithNickNames });
  } catch (error) {
    console.error("댓글 불러오기 중 에러 발생:", error.message);
    return res.status(500).json({ error: "서버 에러 발생." });
  }
});

module.exports = router;
