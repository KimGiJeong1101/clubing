const nodemailer = require('nodemailer'); // Nodemailer를 사용해 이메일 전송
const AuthCode = require('../models/authCodes'); 

// SMTP 설정
const smtpTransport = nodemailer.createTransport({
    pool: true, // SMTP 서버와의 연결을 재사용 가능하도록 설정
    maxConnection: 5, // 동시 이메일 전송 요청 수 / 기본 설정: 5 ~ 10
    service: 'never', // 실제 서비스 제공자가 아닌 커스텀 SMTP 서버 사용
    host: 'smtp.naver.com', // Naver의 SMTP 서버 주소
    port: 587, // SMTP 서버 포트 (TLS 연결을 위한 포트)
    secure: false, // TLS가 활성화되지 않음
    requireTLS: true, // TLS 연결을 필수로 요구
    auth: {
        user: process.env.EMAIL_USER, // 환경 변수에서 이메일 사용자명 가져오기
        pass: process.env.EMAIL_PASS  // 환경 변수에서 이메일 비밀번호 가져오기
    },
    tls: {
        rejectUnauthorized: false // 인증되지 않은 TLS 인증서를 허용
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

    // 인증번호와 만료 시간을 MongoDB에 저장
    const authCode = new AuthCode({
        email,
        codeId,
        number,
        expires: Date.now() + 10 * 60 * 1000 // 10분 후 만료
    });

    try {
        await authCode.save(); // MongoDB에 저장
    // 이메일 전송을 위한 옵션 설정
    const mailOptions = {
        from: process.env.EMAIL_USER, // 발신자 이메일 주소
        to: email, // 수신자 이메일 주소
        subject: "인증 관련 메일입니다.", // 이메일 제목
        html: `<h1>인증번호를 입력해주세요</h1>
                <p>${number}</p>`, // 이메일 본문 (인증번호 포함)
    };

        // 이메일 전송
        await smtpTransport.sendMail(mailOptions);
        // 성공적으로 이메일이 전송되면 클라이언트에 응답
        res.json({ ok: true, codeId, authNum: number }); 
    } catch (err) {
        // 이메일 전송 중 오류가 발생하면 오류 로그를 남기고 클라이언트에 오류 메시지 반환
        console.error('메일 전송 오류:', err);
        res.json({ ok: false, msg: '메일 전송에 실패하였습니다.' , error: err.message});
    } finally {
        // SMTP 연결 종료
        smtpTransport.close();
    }
}
