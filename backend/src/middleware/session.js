const expressSession = require("express-session"); // express-session 모듈 가져오기
const MongoStore = require("connect-mongo");
require("dotenv").config(); // .env 파일 로딩

// 세션 미들웨어 설정
const sessionConfig = {
  secret: process.env.SESSION_SECRET, // 세션 암호화에 사용될 비밀 키
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS 사용 시 true
    maxAge: 1 * 60 * 60 * 1000, // 쿠키 만료 시간 (24시간)
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // MongoDB에 세션 저장
};

// express-session을 설정한 후 모듈로 내보내기
module.exports = expressSession(sessionConfig);
