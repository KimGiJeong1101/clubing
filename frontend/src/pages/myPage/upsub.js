import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // 추가: useNavigate 훅을 가져옵니다.
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../store/actions/userActions'
import HomeSearch from '../../auth/RegisterPage/address/HomeSearch';
import WorkplaceSearch from '../../auth/RegisterPage/address/WorkplaceSearch';
import InterestSearch from '../../auth/RegisterPage/address/InterestSearch';
import CategoryPopup from '../../auth/RegisterPage/category/CategoryPopup';
import categories from '../../auth/RegisterPage/category/CategoriesData';
import JobPopup from '../../auth/RegisterPage/job/JobPopup';
import JobCategories from '../../auth/RegisterPage/job/JobCategories';
import MarketingPopup from '../../auth/RegisterPage/consent/Marketing';
import axiosInstance from '../../../utils/axios'
import { TextField, Button, Typography, Box, Stack, IconButton, InputAdornment, FormControlLabel,
          FormControl, InputLabel, Select, MenuItem, FormHelperText, DialogActions,
          Chip, Checkbox, Paper, Link
        } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import color from '../../../color'; // 색상를 정의한 파일
import '../../../assets/styles/LoginCss.css'

const MyUpdate = () => {
  const user = useSelector((state) => state.user?.userData?.user || {});
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control  } = 
  useForm({  
            defaultValues: {
              name: user.name || '',
              nickName: user.nickName || '',
              age: user.age || { year: '', month: '', day: '' },
              gender: user.gender || '',
              phone: user.phone || '',
              homeLocation: user.homeLocation || { city: '', district: '', neighborhood: '' },
              workplace: user.workplace || { city: '', district: '', neighborhood: '' },
              interestLocation: user.interestLocation || { city: '', district: '', neighborhood: '' },
              job: user.job || [],
              category: user.category || [],
              marketingAccepted: user.marketingAccepted || false
            },
            mode: 'onChange'});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 정보수정 폼 제출 시 실행되는 함수
  const onSubmit = async (data) => {
    console.log('폼 제출 데이터:', data);
    const { password, name, nickName, age = {}, gender, 
            homeLocation = {}, workplace = {}, interestLocation = {}, 
            selectedJobs = [], category = [], phone = '',  } = data;
            
    //console.log('Checked asdasd:', checked); 
    const { marketing } = checkboxState;

    const { year = '', month = '', day = '' } = age;
    const { sido = '', sigoon = '', dong = '' } = homeLocation;
    const { w_sido = '', w_sigoon = '', w_dong = '' } = workplace;
    const { i_sido = '', i_sigoon = '', i_dong = '' } = interestLocation;
  
     const categoryObject = category.reduce((acc, cat) => {
      if (cat.main && Array.isArray(cat.sub)) {
        acc.push({
          main: cat.main,
          sub: cat.sub
        });
      }
      return acc;
    }, []);

    // 현재 비밀번호를 기존 비밀번호로 설정 (사용자 객체에 있는 기존 비밀번호를 사용)
    const currentPassword = user.password || '';

    //이 코드는 category 배열을 객체 형태로 변환합니다. 배열의 각 요소가 main과 sub을 포함한 객체로 변환됩니다.
    // 언디파인드 대비해서 초기값 넣기
    const body = {
      password: password ? password : currentPassword, // 비밀번호가 입력된 경우에만 업데이트
      name,
      nickName,
      age: {
        year,
        month,
        day
      },
      gender,
      homeLocation: {
        city: sido,
        district: sigoon,
        neighborhood: dong,
      },
      workplace: {
        city: w_sido,
        district: w_sigoon,
        neighborhood: w_dong,
      },
      interestLocation: {
        city: i_sido,
        district: i_sigoon,
        neighborhood: i_dong,
      },
      category: categoryObject, // 카테고리 추가
      job:selectedJobs,// 직종 추가
      phone,
      marketingAccepted: marketing,
    }
   
  
    try {
      const response = await axiosInstance.put('/users/myPage/update', body);
      // 성공적으로 업데이트된 경우
      alert('수정되었습니다.')
      navigate('/mypage'); // 성공 페이지로 리다이렉트
    } catch (error) {
      console.error('정보 수정 실패:', error);
      // 에러 처리 로직
    }
  };
  
  //api
  const apiUrl = process.env.REACT_APP_API_URL;

  // 상태 정의
   const [homeLocation, setHomeLocation] = useState({ sido: '', sigoon: '', dong: '' });
   const [workplace, setWorkplace] = useState({ w_sido: '', w_sigoon: '', w_dong: '' });
   const [interestLocation, setInterestLocation] = useState({ i_sido: '', i_sigoon: '', i_dong: '' });

   // 성별 값 설정 함수 // 무이로 바꿔서 잠시 보류
  const setGender = (value) => {
    setValue('gender', value);
  };
// register가 사용되지 않았지만 성별 값이 폼에 포함되는 이유는 setValue 함수와 watch 함수 덕분입니다.

  // 이름 유효성 검사 규칙
  const userName = (name) => {
    // 최대 길이 검증
    if (name.length > 20) {
      return "최대 20자입니다.";
    }
    // 숫자 검증
    if (/[0-9]/.test(name)) {
      return "숫자는 들어갈 수 없습니다.";
    }
    // 특수문자 검증
    if (/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(name)) {
      return "특수문자는 들어갈 수 없습니다.";
    }
    // 자음/모음 검증
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(name)) {
      return "자음과 모음은 들어갈 수 없습니다.";
    }
    return true; // 모든 검증을 통과한 경우
  };

  // 닉네임
  const nickName = {
    maxLength: {
      value: 20,
      message: "닉네임은 최대 20자까지 입력할 수 있습니다."
    }
  };

  // 비밀번호 유효성 검사 규칙
  const userPassword = {
    // required: "필수 필드입니다.",
    // minLength: {
    //   value: 8,
    //   message: "최소 8자입니다."
    // },validate: value => {
    //   // 비밀번호 유효성 검사 정규 표현식
    //    const regex = /^(?=.*[a-zA-Z\u3131-\uD79D])(?=.*[\W_]).{6,}$/;
    //    if (!regex.test(value)) {
    //      return '안전한 비밀번호를 위해 영문 대/소문자, 특수문자 사용해 주세요.';
    //    }
    //    return true; // 유효성 검사 통과
    // }
  };

  const userPasswordCheck = {
    // required: 0,
    // minLength: {
    //   value: 8,
    //   message: "최소 8자입니다."
    // },
    // validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.'
  };

  // 연도, 월, 일을 위한 옵션 생성
  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i);
    }
    return options;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPasswordCheck = () => setShowPasswordCheck(!showPasswordCheck);


// 생년월일 범주
  const years = generateOptions(1950, 2040);
  const months = generateOptions(1, 12);
  const days = generateOptions(1, 31);

// 값설정
  useEffect(() => {
    setValue('homeLocation.sido', homeLocation.sido);
    setValue('homeLocation.sigoon', homeLocation.sigoon);
    setValue('homeLocation.dong', homeLocation.dong);
  }, [homeLocation, setValue]);

  useEffect(() => {
    setValue('workplace.w_sido', workplace.w_sido);
    setValue('workplace.w_sigoon', workplace.w_sigoon);
    setValue('workplace.w_dong', workplace.w_dong);
  }, [workplace, setValue]);

  useEffect(() => {
    setValue('interestLocation.i_sido', interestLocation.i_sido);
    setValue('interestLocation.i_sigoon', interestLocation.i_sigoon);
    setValue('interestLocation.i_dong', interestLocation.i_dong);
  }, [interestLocation, setValue]);


//카테고리
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태 관리
  const [groupedCategories, setGroupedCategories] = useState({});

  useEffect(() => {
    if (user && user.category) {
      // user.category를 변환하여 formattedCategories에 저장
      const formattedCategories = user.category.flatMap(cat => {
        // sub 배열을 평탄화
        const flattenedSub = cat.sub.flat();
  
        // sub 항목을 개별 객체로 변환하며, main 값을 유지
        return flattenedSub.map(item => ({
          main: cat.main,
          sub: item
        }));
      });
  
      console.log("Formatted Categories:", formattedCategories); // 변환된 데이터 확인
      setSelectedCategories(formattedCategories); // 상태 업데이트
    }
  }, [user]);
// 직종
const [isJobPopupOpen, setIsJobPopupOpen] = useState(false); // 직종 팝업
const [selectedJobs, setSelectedJobs] = useState([]); 
//console.log("직업 데이터", selectedJobs)

useEffect(() => {
  // user 데이터가 있을 때 selectedCategories에 category 설정
  if (user && user.job) {
    // 변환된 데이터를 상태로 설정
    setSelectedJobs(user.job);
  }
}, [user]);

// 카테고리를 그룹화하는 함수
function groupCategories(categories) {
  return categories.reduce((acc, cat) => {
    if (!acc[cat.main]) {
      acc[cat.main] = [];
    }
    acc[cat.main].push(cat.sub);
    return acc;
  }, {});
}

 // 카테고리 상태가 변경될 때 폼 데이터와 동기화
 useEffect(() => {
  console.log("Selected Categories updated:", selectedCategories);
  const grouped = groupCategories(selectedCategories);
  console.log("Grouped Categories:", grouped);
  //console.log("카테고리 확인", grouped);

  // grouped 데이터를 categoryData 형식으로 변환
  const categoryData = Object.keys(grouped).map(main => ({
    main: main,
    sub: grouped[main]
  }));

  setGroupedCategories(grouped); // 상태 업데이트
  setValue('category', categoryData); // 폼 데이터와 상태 동기화
  //console.log("카테고리 그룹 확인", categoryData);
}, [selectedCategories, setValue]);

// 직종
useEffect(() => {
  setValue('selectedJobs', selectedJobs);
  //console.log("선택된 직종:", selectedJobs);
}, [selectedJobs, setValue]);

  // 카테고리 선택 핸들러
 // 통합된 핸들러
 const handleSelection = (newSelections) => {
  console.log("New Selections:", newSelections);
  if (isCategoryPopupOpen) {
    setSelectedCategories(newSelections); // 카테고리 선택 시 업데이트
  } else if (isJobPopupOpen) {
    setSelectedJobs(newSelections); // 직종 선택 시 업데이트
  }
};

//팝업 오픈
  const handlePopupOpen = (type) => {
    //console.log("Popup type:", type);//
    if (type === 'category') {
      setIsCategoryPopupOpen(true);
    } else if (type === 'job') {
      setIsJobPopupOpen(true);
    }
  };
//팝업 크로즈
  const handlePopupClose = (type) => {
    if (type === 'category') {
      setIsCategoryPopupOpen(false);
    } else if (type === 'job') {
      setIsJobPopupOpen(false);
    }
  };

// 전화번호 하이픈  자동생성
const formatPhoneNumber = (value) => {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  // 하이픈 추가
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

useEffect(() => {
  if (user && user.marketingAccepted !== undefined) {
    setCheckboxState(prevState => ({
      ...prevState,
      marketing: user.marketingAccepted
    }));
  }
}, [user]);

/// 약관 동의 상태
const [isPopupOpen, setIsPopupOpen] = useState({
  marketing: false,
});

// 체크박스 상태
const [checkboxState, setCheckboxState] = useState({
  marketing: false,
});

// 체크박스 상태를 업데이트하는 함수
const handleCheck = (type) => {
  setCheckboxState(prevState => {
    // 개별 체크박스의 상태를 반전시킵니다
    const newState = !prevState[type];
    // 모든 체크박스가 체크된 상태인지 확인합니다
    const allChecked = ['marketing'].every(key => prevState[key]);
    return {
      ...prevState,
      [type]: newState,
      all: allChecked
    };
  });
};


useEffect(() => {
  console.log('업데이트된 체크박스 상태:', checkboxState);
}, [checkboxState]);

// 팝업 열기
const consentPopupOpen = (type) => {
  setIsPopupOpen(prev => ({ ...prev, [type]: true }));
};

// 팝업 닫기
const consentPopupClose = (type) => {
  setIsPopupOpen(prev => ({ ...prev, [type]: false }));
};

  return (

    <Box 
      sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          maxWidth: 600, 
          mx: 'auto' }}>
    <Box 
      sx={{ 
        p: 3, 
        bgcolor: 'white', 
        borderRadius: 2, 
        boxShadow: 3 ,
        backgroundColor: color.whiteSmoke, 
        }}>
      <Typography variant="h4" component="h1" align="center">
        정보 수정
      </Typography>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2} sx={{ display: 'flex', flexDirection: 'column' }}>    
          {/* 이메일 레이블과 값이 나란히 위치하도록 하는 부모 Box */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" component="label" htmlFor="email" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
              이메일
            </Typography>
            <Typography
              sx={{
                flex: 1,
                padding: 1,
                bgcolor: 'grey.200',
                borderRadius: 1,
                color: 'text.primary',
                textAlign: 'left',
              }} >
              {user.email}
            </Typography>
          </Box>
        </Box>
{/* 비밀번호 */}
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="body2" component="label" htmlFor="password" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
        비밀번호
      </Typography>
        <TextField
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          {...register('password', userPassword)}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          sx={{ flex: 1 }} // 남은 공간을 채우도록 설정
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="body2" component="label" htmlFor="passwordCheck" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
        번호 확인
      </Typography>
        <TextField
          label="비밀번호 확인"
          type={showPasswordCheck ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          {...register('passwordCheck',  userPasswordCheck)}
          error={!!errors.passwordCheck}
          helperText={errors.passwordCheck ? errors.passwordCheck.message : ''}
          sx={{ flex: 1 }} // 남은 공간을 채우도록 설정
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPasswordCheck}
                  edge="end"
                >
                  {showPasswordCheck ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
    </Box>
{/*이름 */}          
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" component="label" htmlFor="name" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
          이름
        </Typography>
          <TextField
            id="name"
            label="이름"
            type="text"
            fullWidth
            variant="outlined"
            {...register('name', userName)}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
            sx={{ flex: 1 }} // 남은 공간을 채우도록 설정
          />
      </Box>
{/*닉네임 */}          
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
      닉네임
    </Typography>
      <TextField
        id='nickName'
        label="닉네임"
        type='text'
        fullWidth
        variant="outlined"
        {...register('nickName', nickName)}
        error={!!errors.nickName}
        helperText={errors.nickName ? errors.nickName.message : ''}
        sx={{ flex: 1 }} // 남은 공간을 채우도록 설정
        />
    </Box>         
{/*생년월일 */}
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
      생년월일
    </Typography>
    <Box sx={{ display: 'flex', flex: 1, gap: 2, mt: 2 }}>
    {/* 생년 */}
    <FormControl fullWidth variant="outlined" error={!!errors.age?.year}>
    <InputLabel id="year-label">출생년도</InputLabel>
    <Controller
      name="age.year"
      control={control}
      defaultValue=""
      rules={{ required: '출생년도는 필수입니다.' }}
      render={({ field }) => (
        <Select
          {...field}
          labelId="year-label"
          label="연도"
        >
          <MenuItem value="">선택</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    <FormHelperText>{errors.age?.year?.message}</FormHelperText>
  </FormControl>
{/* 월 */}
  <FormControl fullWidth variant="outlined" error={!!errors.age?.month}>
    <InputLabel id="month-label">월</InputLabel>
    <Controller
      name="age.month"
      control={control}
      defaultValue=""
      rules={{ required: '월은 필수입니다.' }}
      render={({ field }) => (
        <Select
          {...field}
          labelId="month-label"
          label="월"
        >
          <MenuItem value="">선택</MenuItem>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    <FormHelperText>{errors.age?.month?.message}</FormHelperText>
  </FormControl>

  {/* 일 */}
  <FormControl fullWidth variant="outlined" error={!!errors.age?.day}>
    <InputLabel id="day-label">일</InputLabel>
    <Controller
      name="age.day"
      control={control}
      defaultValue=""
      rules={{ required: '일은 필수입니다.' }}
      render={({ field }) => (
        <Select
          {...field}
          labelId="day-label"
          label="일"
        >
          <MenuItem value="">선택</MenuItem>
          {days.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    <FormHelperText>{errors.age?.day?.message}</FormHelperText>
  </FormControl>
  </Box>
</Box>
{/* 성별 선택 버튼 */}
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
        성별
      </Typography>
      <Box sx={{ display: 'flex', flex: 1, gap: 2, mt: 2 }}>
        <Controller
          name="gender"
          control={control}
          defaultValue=" "
          rules={{ required: '성별을 선택해 주세요.' }} // 필수 입력 설정
          render={({ field }) => (
            <>
              <Button
                variant="contained"
                onClick={() => field.onChange('남성')}
                className='buttonSub3'
                sx={{
                  flexGrow: 1,
                  // '남성' ? '선택' : '비선택'
                  backgroundColor: watch('gender') === '남성' ? '#004ba0' : '#2196f7', // 선택된 경우와 비선택된 경우 색상 설정
                  color: 'white',
                  border: watch('gender') === '남성' ? '3px solid #4a90e2' : '3px solid transparent', // 선택된 경우 테두리 색상
                  boxShadow: watch('gender') === '남성' ? '0 0 0 3px #4a90e2' : 'none', // 선택된 경우 외부 그림자
                  '&:hover': {
                    backgroundColor: watch('gender') === '남성' ? '#00274d' : '#1976d2', // 호버 시 배경색
                  boxShadow: watch('gender') === '남성' ? '0 0 0 3px #4a90e2' : 'none', // 선택된 경우 외부 그림자
                    
                  }
                }}
              >
                남자
              </Button>
              <Button
                variant="contained"
                onClick={() => field.onChange('여성')}
                className='buttonSub4'
                sx={{
                  flexGrow: 1,
                  backgroundColor: watch('gender') === '여성' ? '#ff4081' : '#ff4081', // 선택된 경우와 비선택된 경우 색상 설정
                  color: 'white',
                  border: watch('gender') === '여성' ? '3px solid #f48fb1' : '3px solid transparent', // 선택된 경우 테두리 색상
                  boxShadow: watch('gender') === '여성' ? '0 0 0 3px #f48fb1' : 'none', // 선택된 경우 외부 그림자
                  '&:hover': {
                    backgroundColor: watch('gender') === '여성' ? '#8e0000' : '#c2185b', // 호버 시 배경색
                    boxShadow: watch('gender') === '여성' ? '0 0 0 3px #f48fb1' : 'none', // 선택된 경우 외부 그림자
                  }
                }}
              >
                여자
              </Button>
            </>
          )}
        />
      </Box>
      {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
    </Box>
{/* 전화번호 */}
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
        전화번호 
      </Typography>

        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: '전화번호는 필수입니다.',
            pattern: {
              value: /^\d{3}-\d{4}-\d{4}$/, // 예: 010-7430-3504
              message: '전화번호 형식을 확인해 주세요.\n 예) 010-7430-3504',
            }
          }}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                id="phone"
                fullWidth
                variant="outlined"
                placeholder="010-7430-3504"
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ''}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  setValue('phone', formattedValue, { shouldValidate: true }); // 포맷된 값을 폼 상태에 설정
                }}
                value={watch('phone')}
              />
            </>
          )}
        />
    </Box>
{/*집주소 */}
<Box mb={2}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
      집주소
    </Typography>
      <HomeSearch 
        setSelectedSido={(sido) => setHomeLocation(prev => ({ ...prev, sido }))} 
        setSelectedSigoon={(sigoon) => setHomeLocation(prev => ({ ...prev, sigoon }))} 
        setSelectedDong={(dong) => setHomeLocation(prev => ({ ...prev, dong }))} />
  </Box>
{/*직장 */}
<Box sx={{ display: 'flex', alignItems: 'center' }}>
{/* <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
 현재 직장 주소
</Typography>
<Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
{workplaceLocation.sido} {workplaceLocation.sigoon} {workplaceLocation.dong}
</Typography> */}
</Box>
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  
  <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
      직장 주소
    </Typography>
    {/* WorkplaceSearch 컴포넌트에 초기값 및 상태 업데이트 함수를 전달 */}
      <WorkplaceSearch 
        setWorkplaceSido={(sido) => setWorkplace(prev => ({ ...prev, w_sido: sido }))} 
        setWorkplaceSigoon={(sigoon) => setWorkplace(prev => ({ ...prev, w_sigoon: sigoon }))} 
        setWorkplaceDong={(dong) => setWorkplace(prev => ({ ...prev, w_dong: dong }))} />    
 </Box>
{/*관심지역 */}
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
   관심지역
    </Typography>

      <InterestSearch 
        setInterestSido={(sido) => setInterestLocation(prev => ({ ...prev, i_sido: sido }))} 
        setInterestSigoon={(sigoon) => setInterestLocation(prev => ({ ...prev, i_sigoon: sigoon }))} 
        setInterestDong={(dong) => setInterestLocation(prev => ({ ...prev, i_dong: dong }))} />
  </Box>
</Box>     
{/*직종 */}
<Box>
      {/* 직종 선택 버튼 */}
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePopupOpen('job')}
        >
          직종 선택
        </Button>
      </Box>

      {isJobPopupOpen && (
       <JobPopup
          jobCategories={JobCategories} // 여기를 확인해봐야 합니다
          onSelect={handleSelection}
          onClose={() => handlePopupClose('job')}
          selectedJobs={selectedJobs}// 선택된 카테고리 전달
        />
      )}

      {/* 선택된 직종 리스트 */}
      <Box 
      sx={{ 
        mb: 2, 
        p: 2, 
        bgcolor: 'background.paper', // 배경색 설정
        borderRadius: 2, // 모서리 둥글게
        boxShadow: 1, // 그림자 추가
        border: '1px solid', // 테두리 추가
        borderColor: 'divider' // 테두리 색상 설정
      }}
    >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedJobs.map((job, index) => (
            <Chip
              key={index}
              label={job}
              onDelete={() => setSelectedJobs(prev => prev.filter(j => j !== job))}
              sx={{ bgcolor: 'lightgrey', color: 'black' }} // 배경색과 글자색을 직접 설정
            />
          ))}
        </Box>
      </Box>
</Box>
{/* 카테고리 */}
<Box>
      {/* 카테고리 선택 버튼 */}
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePopupOpen('category')}
        >
          카테고리 선택
        </Button>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
          3개 이상 선택해 주세요
        </Typography>
      </Box>

      {/* 카테고리 팝업 */}
      {isCategoryPopupOpen && (
        <CategoryPopup 
          categories={categories} 
          onSelect={handleSelection}
          onClose={() => handlePopupClose('category')}
          selectedCategories={selectedCategories}
        />
      )}

      {/* 선택된 카테고리 리스트 표시 */}
      <Box 
        sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: 'background.paper', // 배경색 설정
          borderRadius: 2, // 모서리 둥글게
          boxShadow: 1, // 그림자 추가
          border: '1px solid', // 테두리 추가
          borderColor: 'divider' // 테두리 색상 설정
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(groupedCategories).map(([main, subs]) => (
            <Box key={main} sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {main}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {subs.map((sub, index) => (
                  <Chip
                    key={index}
                    label={sub}
                    onDelete={() => setSelectedCategories(prev => prev.filter(cat => !(cat.main === main && cat.sub === sub)))}
                    sx={{ bgcolor: 'lightgrey', color: 'black' }} // 배경색과 글자색을 직접 설정
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
{/*약관 동의 */}
{/* 동의 항목 */}
<Box mt={4}>
{/* 마케팅 동의 */}
<Box mb={2}>
      <Box display="flex" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              id="marketing-checkbox"
              checked={checkboxState.marketing}
              onChange={() => handleCheck('marketing')}
              color="primary"
            />
          }
          label={
            <Typography variant="body1" component="span">
              [선택] 마케팅 동의
            </Typography>
          }
          sx={{ marginRight: 1 }} // 체크박스와 라벨 사이에 간격 추가
        />
        <Button
          variant="text"
          color="primary"
          onClick={() => consentPopupOpen('marketing')}
          sx={{ textDecoration: 'underline' }}
        >
          전체
        </Button>
      </Box>
    </Box>
</Box>
      {/* 팝업 모달 */}
      {isPopupOpen.marketing && (
        <MarketingPopup onClose={() => consentPopupClose('marketing')} 
        handleCheck={handleCheck}
        checked={{ marketing: checkboxState.marketing }}
        />
      )}
{/*정보수정 버튼 */}
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '100%', px: 4, py: 2, borderRadius: '8px', backgroundColor: 'black', '&:hover': { backgroundColor: 'gray.700' } }}
            >
              수정 하기
            </Button>
          </Box>
        </form>
      </Box>
      </Box>
  );
};

export default MyUpdate