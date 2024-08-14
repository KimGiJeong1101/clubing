import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../store/actions/userActions'
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel, InputAdornment } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // 아이콘
import Mail from '@mui/icons-material/MailOutline'; // 아이콘
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // 값 설정을 위해 사용
    watch // 상태를 감시하기 위해 사용
  } = useForm({ mode: 'onChange' })

  const dispatch = useDispatch();
  const rememberMe = watch('rememberMe'); // rememberMe 체크박스의 값 확인
  const navigate = useNavigate(); // useNavigate 사용

  // 아이디 중복 / 비번 정확성 확인 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

   useEffect(() => {
    const savedEmail = localStorage.getItem('lastLoginEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    setValue('rememberMe', rememberMe); // 체크박스 상태 설정

    if (savedEmail) {
      setValue('email', savedEmail); // 입력 필드에 값 설정
    }
  }, [setValue]);

  const onSubmit = async ({ email, password }) => {
    try {
    const body = {
      email,
      password
    }
    const response = await dispatch(loginUser(body)); 
    //thunk에서 생성한 펜딩,풀필드, 리젝트 값 userSlice로 보내기
    //상태관리

      // 로그인 성공 여부 확인
      if (response.meta.requestStatus === 'fulfilled') {
        navigate('/clublist');
        reset();
      } else {
          // 여기에서 에러를 처리합니다.
      if (response.payload.error === '이메일이 확인되지 않습니다.') {
        setEmailError('이메일이 확인되지 않습니다.');
        setPasswordError('');
      } else if (response.payload.error === '비밀번호가 틀렸습니다.') {
        setPasswordError('비밀번호가 틀렸습니다.');
        setEmailError('');
      }
    }
      // "Remember Me" 체크박스가 선택되었을 때만 로컬 스토리지에 저장
      if (rememberMe) {
        localStorage.setItem('lastLoginEmail', email);
        localStorage.setItem('rememberMe', 'true'); // 체크 상태 저장
      } else {
        localStorage.removeItem('lastLoginEmail');
        localStorage.setItem('rememberMe', 'false'); // 체크 해제 상태 저장
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      // 서버 오류 또는 네트워크 오류 처리
        setEmailError('이메일 입력에 문제가 발생했습니다.');
        setPasswordError('비밀번호 입력에 문제가 발생했습니다.');
    }
  }

  const userEmail = {
    required: "필수 필드입니다.",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "유효한 이메일 주소를 입력하세요."
    }
  }

  const userPassword = {
    required: '필수 필드입니다.',
    minLength: {
      value: 6,
      message: "최소 6자입니다."
    }
  }

  //className 대신 sx
  return (
    
    <Container 
    sx={{
      mt: 8,
      width: '100%',
      maxWidth: {
        xs: '120%',    // 모바일 화면: 최대 너비를 90%로 설정
        sm: '500px',  // 작은 화면: 최대 너비를 600px로 설정
      },
      padding: {
        xs: '8 8px',  // 모바일 화면: 좌우 패딩 8px
        sm: '8 10px', // 작은 화면: 좌우 패딩 16px
      },
    }}>
       <Typography variant="h3" component="h1" 
       sx={{ 
        mt: 2,
        mb: 2,
        textAlign: 'center',
         }}>
        로고 넣자요asdfasdfasdfasdfasdf
        </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          boxShadow: 3,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" component="h1" 
          sx={{ 
            mb: 2, 
            alignSelf: 'flex-start', // 부모 요소와 상관없이 해당 요소만 왼쪽 정렬
            fontWeight: 'bold'  
            }}>
          로그인
          로그인
          로그인
          로그인
          로그인
        </Typography>
 {/* 아이디 */}
        <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center"
         sx={{
          width: '120%', // 부모 요소의 너비를 100%로 설정
        }}>
          <Mail style={{ 
              marginRight: '5px',
              marginLeft: '-50px', 
              marginBottom: '10px',  
              color: 'gray', 
              fontSize: '40px', }} />
          <TextField
            fullWidth
            label="이메일"
            margin="normal"
            variant="outlined"
            error={!!emailError || !!errors.email} // 이메일 에러가 있을 때 빨간 박스
            helperText={emailError || errors.email?.message || " "} // 이메일 에러 메시지
            {...register('email', userEmail)}
          />
           </Box>
 {/* 비밀번호 */}
          <Box display="flex" alignItems="center"
           sx={{
            width: '120%', // 부모 요소의 너비를 100%로 설정
          }}>
          <LockOutlinedIcon style={{ 
              marginRight: '5px',
              marginLeft: '-50px',  
              marginBottom: '10px',  
              color: 'gray', 
              fontSize: '40px' }} />     
          <TextField
            fullWidth
            label="패스워드"
            margin="normal"
            variant="outlined"
            type="password"
            error={!!passwordError || !!errors.password} // 비밀번호 에러가 있을 때 빨간 박스
            helperText={passwordError || errors.password?.message || " "} // 비밀번호 에러 메시지
            {...register('password', userPassword)}
          />
          </Box>  
 {/* 아이디 기억 */} 
           <FormControlLabel
            control={
              <Checkbox
                {...register('rememberMe')} 
                checked={watch('rememberMe') ? true : false} // register로 상태 관리
              />
            }
            label='아이디 기억하기'
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              mt: 3, 
              mb: 2 
            }}
          >
            로그인
          </Button>
          <Typography variant="body2" align="center" 
          sx={{
             mt: 2,
              '& a': {
                textDecoration: 'none', // 기본 상태에서 밑줄 제거
                color: 'blue', // 기본 글자색
                transition: 'color 0.3s', // 부드러운 색상 전환
                '&:hover': {
                  textDecoration: 'underline', // 호버 시 밑줄 추가
                  color: 'darkblue', // 호버 시 글자색 변경
                }
              }
             }}>
            처음 방문하셨나요?{' '}|{' '}
            {/*{' '} 공백추가  */}
            <a href="/register" >
              회원가입
            </a>
          </Typography>
        </form>
      </Box>
      <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      flexDirection="row" // 수직으로 배치하려면 'column'으로 변경
      sx={{ mt: 2 }}
    >
      
      <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            mx: 2,
            '& a': {
              textDecoration: 'none',
              transition: 'text-decoration 0.3s',
              '&:hover': {
                textDecoration: 'underline', // 호버 시 밑줄을 추가
              }
            }
           }}>
        <a href="/">
          아이디 찾기
        </a>
      </Typography>
      <Typography>
        |
      </Typography>
      <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mx: 2,
            '& a': {
              textDecoration: 'none',
              transition: 'text-decoration 0.3s',
              '&:hover': {
                textDecoration: 'underline', // 호버 시 밑줄을 추가
              }
            }
           }}>
        <a href="/">
          비밀번호 찾기
        </a>
      </Typography>
    </Box>
    </Container>
  )
}

export default LoginPage
