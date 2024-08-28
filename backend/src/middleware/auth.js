const jwt = require("jsonwebtoken");
const User = require("../models/User");
/// 무한 리다이렉트 서브 페이지
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
    
      const payload = {
      userId: user._id.toHexString(),
      // 몽고db objectid는 지멋대로 생성하기 때문에 이것을 스트링화 하는 것
      }
      // token을 생성
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
      // 유효기간 1시간

      req.session.touch();
      req.session.accessToken = accessToken;

      next(); // 미들웨어 다음 단계로 넘어감
    } catch (error) {
      return res.status(406).send("유효하지 않은 토큰입니다.");
    }
  } else {
    console.log('세션이 유효하지 않습니다.');
    return res.status(401).send("세션이 유효하지 않습니다.");
  }
};

module.exports = sessionAuth;
