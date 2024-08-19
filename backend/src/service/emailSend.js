const nodemailer = require('nodemailer'); // Nodemailer를 사용해 이메일 전송
const AuthCode = require('../models/authCodes'); 

// SMTP 설정
const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnection: 10,
    maxMessages: 10, // 최대 10개의 메시지
    service: 'never',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// 주어진 범위 내에서 임의의 정수 생성
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 임의의 9자리 문자열 생성
const generateCodeId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// 이메일을 통해 인증번호를 전송하는 함수
exports.sendAuthEmail = async (req, res) => {
    const codeId = generateCodeId(); // 고유한 인증 코드 ID 생성
    const number = generateRandomNumber(111111, 999999); // 인증번호 생성
    const { email } = req.body; // 요청 본문에서 이메일 주소 가져오기

    // 환경 변수에서 요청 제한과 창 기간 가져오기
    const requestLimit = parseInt(process.env.EMAIL_REQUEST_LIMIT, 10);
    const requestWindow = parseInt(process.env.EMAIL_REQUEST_WINDOW, 10);

     // 요청 기록 조회
     let authCode = await AuthCode.findOne({ email });

     if (authCode) {
         const now = Date.now();
         const timeSinceLastRequest = now - authCode.lastRequestAt;
 
         // 요청 횟수와 시간 제한 확인
         if (authCode.requestCount >= requestLimit && timeSinceLastRequest < requestWindow) {
             return res.status(429).json({ ok: false, msg: '인증 요청 횟수를 초과했습니다. 나중에 다시 시도해 주세요.' });
         }
 
         // 시간 제한이 지나면 요청 카운트 리셋
         if (timeSinceLastRequest >= requestWindow) {
             authCode.requestCount = 0;
             authCode.lastRequestAt = now;
         }
 
         // 요청 카운트 증가
         authCode.requestCount += 1;
     } else {
         // 새로운 이메일 요청 기록 생성
         authCode = new AuthCode({
             email,
             codeId,
             number,
             expires: Date.now() + 3 * 60 * 1000, // 3분 후 만료
             lastRequestAt: Date.now(),
             requestCount: 1
         });
     }
 
     try {
         await authCode.save();
 
         const mailOptions = {
             from: process.env.EMAIL_USER,
             to: email,
             subject: "인증 관련 메일입니다.",
             html: `<h1>인증번호를 입력해주세요</h1><p>${number}</p>`,
         };
 
         await smtpTransport.sendMail(mailOptions);
         res.json({ ok: true, codeId, authNum: number });
     } catch (err) {
         console.error('메일 전송 오류:', err);
         res.json({ ok: false, msg: '메일 전송에 실패하였습니다.', error: err.message });
     } finally {
         smtpTransport.close();
     }
 };