const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

/////////////////////////////////////라우터 구간
//라우터 미들웨어(보드)
const boardsRouter = require("./src/routes/boards");
app.use("/boards", boardsRouter);

//라우터 미들웨어(채팅)
const chatsRouter = require("./src/routes/chats");
app.use("/chats", chatsRouter);

//라우터 미들웨어(클럽)
const clubsRouter = require("./src/routes/clubs");
app.use("/clubs", clubsRouter);

//라우터 미들웨어(갤러리)
const galleriesRouter = require("./src/routes/galleries");
app.use("/galleries", galleriesRouter);

//라우터 미들웨어(미팅)
const meetingsRouter = require("./src/routes/meetings");
app.use("/meetings", meetingsRouter);

//라우터 미들웨어(댓글)
const repliesRouter = require("./src/routes/replies");
app.use("/replies", repliesRouter);

//라우터 미들웨어(유저)
const usersRouter = require("./src/routes/users");
app.use("/users", usersRouter);

//라우터 미들웨어(유저로그인)
const userSignsRouter = require("./src/routes/userSigns");
app.use("/userSigns", userSignsRouter);
/////////////////////////////////////라우터 구간 .end

// 간단한 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("몽고디비 연결 완료");

    app.listen(process.env.PORT, () => {
      console.log(`서버 시작 ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};
startServer();
/////이 이후 하나씩 추가할 거 작성은 주석달아서 추가해놓고 말해주기!
