const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sessionAuth = require('../middleware/sessionAuth');
const async = require('async');
const { sendAuthEmail, verifyAuthCode } = require('../service/authController');

//sns
const passport = require('passport');


router.get('/auth', sessionAuth, async (req, res, next) => {
    //auth 미들웨어에서 로그인 정보 가져옴
    return res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    })
})

// Email Check Route
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        // 이메일이 데이터베이스에 존재하는지 확인
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
        }

        return res.status(200).json({ message: '사용 가능한 이메일입니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
});

// 인증 이메일 보내기
router.post('/email-auth', sendAuthEmail);
// 인증 번호 확인
router.post('/verifyAuth', verifyAuthCode);

router.post('/register', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        // 이메일 확인 
        const user = await User.findOne({email : req.body.email});
        console.log(user);
        if (!user) {
            return res.status(400).send("이메일이 없음");
        }
        // 비밀번로가 올바른 것인지 체크
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send('틀린 비번');
        }
        const payload = {
            userId: user._id.toHexString(),
            // 몽고db objectid는 지멋대로 생성하기 때문에 이것을 스트링화 하는 것
        }
        console.log(payload);
        // token을 생성
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        // 유효기간 1시간
		// JWT_SECRET env 파일에 담긴 시크릿 코드
        console.log(accessToken+'accessTokenaccessToken');

         // 세션에 JWT 저장
         req.session.accessToken = accessToken;
        
        // 세션 상태 확인 (디버깅용)
        console.log('Session:', req.session);

        return res.json({ user, accessToken })
    } catch (error) {
        next(error)
    }
})


router.post('/logout', sessionAuth, async (req, res, next) => {
    try {
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

module.exports = router