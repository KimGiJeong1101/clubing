const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const session = require("./src/middleware/session"); // 세션 설정 로드
require("dotenv").config();

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    //클라이언트에서 서버로 요청을 보낼 때 쿠키와 인증 헤더를 포함할 수 있게 해주는 설정입니다.
    //이 옵션은 클라이언트와 서버 간의 인증된 세션 유지에 중요한 역할을 합니다.
  })
);
app.use(express.json());

// 세션 설정 적용
app.use(session);

/////////////////////////////////////라우터 구간
//라우터 미들웨어(보드)
const boardsRouter = require("./src/routes/boards");
app.use("/clubs/boards", boardsRouter);

//라우터 미들웨어(채팅)
const chatsRouter = require("./src/routes/chats");
app.use("/clubs/chats", chatsRouter);

//라우터 미들웨어(갤러리)
const galleriesRouter = require("./src/routes/galleries");
app.use("/clubs/galleries", galleriesRouter);

//라우터 미들웨어(클럽)
const clubsRouter = require("./src/routes/clubs");
app.use("/clubs", clubsRouter);

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

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // 에러 객체의 상태 코드를 가져와서 응답 상태 코드를 설정합니다. 없으면 기본적으로 500 상태 코드를 사용합니다.
  res.send(err.message || "서버에서 에러가 발생했습니다.");
  // 에러 메시지를 클라이언트에게 전송합니다. 에러 메시지가 없으면 기본 메시지를 사용합니다.
});

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
