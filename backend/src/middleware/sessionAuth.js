const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sessionAuth = async (req, res, next) => {
  if (req.session && req.session.accessToken) {
    try {
      const token = req.session.accessToken; // 세션에서 전체 JWT 토큰을 가져옴
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // 토큰을 검증하고 디코딩
      const user = await User.findOne({ _id: decode.userId }); // 페이로드의 정보를 사용해 사용자 검색
      if (!user) {
        return res.status(400).send("없는 유저입니다.");
      }
      req.user = user;
      // 존마탱으로 어떤 정보를 입맛에 맞게 가져올 수 있는지 공부해보자요
      next();
    } catch (error) {
      return res.status(406).send("유효하지 않은 토큰입니다.");
    }
  } else {
    return res.status(401).send("세션이 유효하지 않습니다.");
  }
};

module.exports = sessionAuth;
