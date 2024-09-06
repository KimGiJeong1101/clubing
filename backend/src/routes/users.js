const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
//const sessionAuth = require('../middleware/sessionAuth');
const auth = require('../middleware/auth');
const async = require('async');
const { sendAuthEmail, verifyAuthCode } = require('../service/authController');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//sns
const passport = require('passport');


router.get('/auth', auth, async (req, res, next) => {
    try {
        const user = req.user; // 로그인된 사용자 정보
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: '탈퇴한 회원입니다.' });
        }
        
        return res.json({ 
            user
         }); // 사용자 정보 반환
    } catch (error) {
        next(error); // 에러 처리
    }
});

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
 
        if (!user) {
            return res.status(400).json({ error: '이메일이 확인되지 않습니다.' });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: '탈퇴한 회원입니다.' });
          }
        // 비밀번로가 올바른 것인지 체크
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ error: '비밀번호가 틀렸습니다.' })
        }
        const payload = {
            userId: user._id.toHexString(),
            // 몽고db objectid는 지멋대로 생성하기 때문에 이것을 스트링화 하는 것
        }
        console.log(payload);
        // token을 생성
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
        // 유효기간 15분

         // 리프레시 토큰 생성
         const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // JWT를 쿠키에 저장
        res.cookie('accessToken', accessToken, {
            httpOnly: true, // 클라이언트 측에서 접근 불가 중요 췤크!!!!
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송 (프로덕션 환경에서) 미친
            //maxAge: 5 * 60 * 1000, // 테스트 (5분)
            maxAge: 15 * 60 * 1000, // 쿠키 만료 시간 설정 (15분)
            sameSite: 'Strict' //  CSRF 공격을 방지 미친
        });

         // 리프레시 토큰을 쿠키에 저장
         res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            //maxAge: 1 * 60 * 1000, // 테스트 (1분)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            sameSite: 'Strict'
        });

        // 응답으로 사용자 정보와 성공 메시지 전송
        return res.json({ user, message: '로그인 성공' });
    } catch (error) {
        next(error)
    }
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ error: '리프레시 토큰이 없습니다.' });
        }

        // 리프레시 토큰 검증
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // 새로운 액세스 토큰 생성
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // 새로운 액세스 토큰을 쿠키에 저장
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            //maxAge: 5 * 60 * 1000, // 테스트 (5분)
            maxAge: 15 * 60 * 1000, // 15분
            sameSite: 'Strict'
        });

        return res.json({ message: '새로운 액세스 토큰이 발급되었습니다.' });
    } catch (error) {
       // 리프레시 토큰이 유효하지 않을 때
       if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: '리프레시 토큰이 유효하지 않습니다.' });
        }
        next(error);
    }
});

//8.22 쿠키랑 세션 삭제
router.post('/logout', (req, res, next) => {
    try {
        // 클라이언트 측에서 쿠키 삭제
        res.clearCookie('accessToken', {
            httpOnly: true, // 클라이언트 측에서 접근 불가
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송 (프로덕션 환경에서)
            sameSite: 'Strict' // CSRF 공격 방지
        });

        res.clearCookie('refreshToken', {
            httpOnly: true, // 클라이언트 측에서 접근 불가
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송 (프로덕션 환경에서)
            sameSite: 'Strict' // CSRF 공격 방지
        });

         // 로그 출력
    console.log('AccessToken 쿠키 삭제:', req.cookies.accessToken); // null이어야 함
    console.log('RefreshToken 쿠키 삭제:', req.cookies.refreshToken); // null이어야 함

        // 로그아웃 성공 응답
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

// src/routes/users.js
router.get('/myPage', auth, async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 프로필 이미지 경로를 웹 URL로 변환
        if (user.profilePic && user.profilePic.originalImage && user.profilePic.thumbnailImage) {
            // 프로필 이미지 URL이 `https://via.placeholder.com/600x400?text=no+user+image`가 아니면 변환
            if (!user.profilePic.originalImage.startsWith('https://via.placeholder.com')) {
                user.profilePic.originalImage = `${user.profilePic.originalImage.replace(/\\/g, '/')}`;
            }

            if (!user.profilePic.thumbnailImage.startsWith('https://via.placeholder.com')) {
                user.profilePic.thumbnailImage = `${user.profilePic.thumbnailImage.replace(/\\/g, '/')}`;
            }
        }
        
        return res.json({ user }); // user 객체를 그대로 반환
    } catch (error) {
        next(error);
    }
})

// 마이페이지에서 수정
router.put('/myPage/update', auth, async (req, res, next) => {
    try {
        // 현재 로그인된 사용자 정보 가져오기
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        const updateData = req.body;

        // 비밀번호를 업데이트할 때는 user.save()를 사용해야 합니다.
        // 사용자의 기존 정보를 로드한 후, 새로운 정보를 적용하고 저장합니다.
        const updatedUser = await User.findById(user._id);
        Object.assign(updatedUser, updateData);
        await updatedUser.save();

        // 업데이트된 사용자 정보 반환
        return res.json(updatedUser);
    } catch (error) {
        // 에러가 발생했을 경우 처리
        next(error);
    }
});
//////////////////// 회원 탈퇴
// 회원 탈퇴 API
router.put('/myPage/delete', auth, async (req, res, next) => {
    try {
      const userId = req.user._id; // 현재 로그인한 사용자의 ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
      // isActive 필드를 false로 설정하여 탈퇴 처리
      user.isActive = false;
      await user.save();
  
      res.status(200).json({ message: '탈퇴가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  });
  

////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정

//폴더 생성
const createDailyFolder = () => {
    const today = new Date(); // 현재 날짜와 시간을 가져옵니다.
    const year = today.getFullYear(); // 현재 연도를 가져옵니다.
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 현재 월을 2자리 문자열로 변환합니다.
    const day = String(today.getDate()).padStart(2, '0'); // 현재 일을 2자리 문자열로 변환합니다.

    // 'profile/년-월-일' 형식의 폴더 경로를 생성합니다.
    const folderPath = path.join('profile', `${year}-${month}-${day}`);
    
    // 폴더가 존재하지 않으면 생성합니다.
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // 중간 폴더가 없어도 모두 생성합니다.
    }

    // 'origin_img' 폴더 경로를 생성합니다.
    const originPath = path.join(folderPath, 'origin_img');
    // 'thumbnail_img' 폴더 경로를 생성합니다.
    const thumbnailPath = path.join(folderPath, 'thumbnail_img');

    // 'origin_img' 폴더가 존재하지 않으면 생성합니다.
    if (!fs.existsSync(originPath)) {
        fs.mkdirSync(originPath);
    }

    // 'thumbnail_img' 폴더가 존재하지 않으면 생성합니다.
    if (!fs.existsSync(thumbnailPath)) {
        fs.mkdirSync(thumbnailPath);
    }

    // 'origin_img'와 'thumbnail_img' 폴더 경로를 반환합니다.
    return { originPath, thumbnailPath };
}

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { originPath } = createDailyFolder(); 
        cb(null, originPath); // 올바른 폴더 경로에 저장
    },
    filename: function (req, file, cb) {
        // 파일 이름 설정
        cb(null, `${Date.now()}_${file.originalname}`); // 파일 이름 설정
    }
});

const upload = multer({ storage: storage });

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

router.put('/profile/image', auth, upload.single('image'), async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
        // 업로드된 파일의 경로
        const originalFilePath = req.file.path;
        console.log('원본 파일 경로:', originalFilePath);
        const originalFileName = req.file.filename;

        // 섬네일 파일 경로 설정
        const { thumbnailPath } = createDailyFolder(); // 기존 폴더 생성 로직 재사용
        const thumbnailFilePath = path.join(thumbnailPath, `thumbnail_${originalFileName}`);

       // 섬네일 생성
        await sharp(originalFilePath)
        .resize(400) // 섬네일 크기 조정
        .toFile(thumbnailFilePath);

         // 절대 URL로 변환
        user.profilePic.originalImage = `${baseURL}/${originalFilePath.replace(/\\/g, '/')}`;
        user.profilePic.thumbnailImage = `${baseURL}/${thumbnailFilePath.replace(/\\/g, '/')}`;

        await user.save();

         // 기존 이미지 및 섬네일 삭제
        const oldImagePath = path.join(__dirname, '..', user.profilePic.originalImage.replace(`${baseURL}/`, ''));
        const oldThumbnailPath = path.join(__dirname, '..', user.profilePic.thumbnailImage.replace(`${baseURL}/`, ''));

        console.log('기존 이미지 삭제 확인:', oldImagePath);
        if (fs.existsSync(oldImagePath) && oldImagePath !== originalFilePath) {
            fs.unlinkSync(oldImagePath); // 이전 이미지 삭제
            console.log('이전 이미지 삭제 완료');
        } else {
            console.log('이전 이미지 파일이 존재하지 않거나 현재 이미지와 동일함');
        }

        console.log('기존 섬네일 삭제 확인:', oldThumbnailPath);
        if (fs.existsSync(oldThumbnailPath) && oldThumbnailPath !== thumbnailFilePath) {
            fs.unlinkSync(oldThumbnailPath); // 이전 섬네일 삭제
            console.log('이전 섬네일 삭제 완료');
        } else {
            console.log('이전 섬네일 파일이 존재하지 않거나 현재 섬네일과 동일함');
        }

        res.json({ success: true, message: '프로필 이미지가 수정되었습니다.' });
    } catch (error) {
        console.error('프로필 이미지 수정 중 오류가 발생했습니다:', error);
        res.status(500).json({ success: false, message: '프로필 이미지 수정 중 오류가 발생했습니다.', error });
    }
});
  
  // 프로필 이미지 삭제 라우트
  router.delete('/profile/image_del', auth, async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
        // 기본 이미지 URL로 설정
        user.profilePic.originalImage = 'https://via.placeholder.com/600x400?text=no+user+image';
        user.profilePic.thumbnailImage = 'https://via.placeholder.com/600x400?text=no+user+image';

        await user.save(); // 사용자 정보 저장
        
        res.json({ success: true, message: '이미지가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: '이미지 삭제 중 오류가 발생했습니다.', error });
    }
});
////////////////////////////////////////////////// 이미지 삭제 ////////////////////////////////////////////////// 이미지 삭제////////////////////////////////////////////////// 이미지 삭제

// 전화번호로 이메일 조회
router.post('/findEmail', async (req, res) => {
    const { phone } = req.body;
    try {
        // 전화번호로 사용자 검색
        const user = await User.findOne({ phone });
        
        if (!user) {
            return res.status(404).json({ message: '해당 전화번호로 등록된 이메일이 없습니다.' });
        }

        // 이메일 반환
        return res.status(200).json({ email: user.email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
});

///로그인 창에서 이메잉로 인증 후 비번 변경
router.post('/validate-email', async (req, res) => {
    const { email } = req.body;
    try {
        // 이메일이 데이터베이스에 존재하는지 확인
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: '이메일이 존재하지 않습니다.' });
        }
        res.status(200).json({ message: '인증 메일이 발송되었습니다.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
});

// 이메일로 인증 받은 후 비밀번호 변경
router.post('/change-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // 필수 데이터 확인
        if (!email || !newPassword) {
            return res.status(400).json({ ok: false, msg: '필요한 데이터가 누락되었습니다.' });
        }

        // 사용자 조회
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ ok: false, msg: '사용자를 찾을 수 없습니다.' });
        }

        // 비밀번호 업데이트
        user.password = newPassword;
        await user.save();

        return res.json({ ok: true, msg: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error('서버 오류:', error);
        return res.status(500).json({ ok: false, msg: '서버 오류가 발생했습니다.' });
    }
});

router.put('/introduction', auth, async (req, res, next) => {
    try {
        const { introduction } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
        
        user.profilePic.introduction = introduction;

        await user.save();

        return res.json({ ok: true, msg: '성공적으로 변경되었습니다.' });

    } catch (error) {
        next(error);
    }
});

module.exports = router; // 올바르게 내보내기