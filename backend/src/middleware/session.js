const expressSession = require("express-session"); // express-session 모듈 가져오기
const MongoStore = require("connect-mongo");
require("dotenv").config(); // .env 파일 로딩

// 세션 미들웨어 설정
const sessionConfig = {
  secret: process.env.SESSION_SECRET, // 세션 암호화에 사용될 비밀 키
  resave: true,
  saveUninitialized: false, // 새로 생성된 세션이 저장되도록 설정
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false, // HTTPS가 아닐 경우 false
    maxAge: 3 * 60 * 60 * 1000, // 쿠키 만료 시간 (3시간)
    // maxAge: 1 * 60 * 1000, // 쿠키 테스트 (1분)
    path: '/', // 쿠키 경로 모든 경로
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // MongoDB에 세션 저장
};


// express-session을 설정한 후 모듈로 내보내기
module.exports = expressSession(sessionConfig);
