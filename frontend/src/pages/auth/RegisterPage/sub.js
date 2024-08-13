import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../store/actions/userActions'
import HomeSearch from './address/HomeSearch';
import WorkplaceSearch from './address/WorkplaceSearch';
import InterestSearch from './address/InterestSearch';
import CategoryPopup from './category/CategoryPopup';
import categories from './category/CategoriesData';
import JobPopup from './job/JobPopup';
import JobCategories from './job/JobCategories';
import axios from 'axios';
import TermsPopup from './consent/Terms' ;
import PrivacyPopup from './consent/Privacy';
import MarketingPopup from './consent/Marketing';


const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = 
  useForm({  
            defaultValues: {
              age: { year: '1990', month: '9', day: '10' },
              gender: '',
              homeLocation: { sido: '', sigoon: '', dong: '' },
              workplace: { w_sido: '', w_sigoon: '', w_dong: '' },
              interestLocation: { i_sido: '', i_sigoon: '', i_dong: '' },
              category: [],
              selectedJobs: [],
              phone: [],
              
              // 필드가 처음 정의될 때 설정값
            },
    mode: 'onChange' });

  const dispatch = useDispatch();

  // 회원가입 폼 제출 시 실행되는 함수
  const onSubmit = (data) => {
    console.log('폼 제출 데이터:', data);
    const { email, password, name, age = {}, 
            gender, homeLocation = {}, workplace = {}, interestLocation = {}, 
            category = [], selectedJobs = [], phone = '', } = data;
            
    //console.log('Checked asdasd:', checked); 

    // 체크박스 상태를 직접 가져옵니다
  const { terms, privacy, marketing } = checkboxState;
  // 온서밋에 안 넣어도 되네 얘 때문에 몇시간을 버린거야 ㅠㅠ

    if (!isVerified) {
      alert('이메일 인증이 완료되지 않았습니다.');
      return; // 인증이 완료되지 않았으면 폼 제출을 중지합니다.
    }
    // 약관 동의 확인
    if (!terms) {
      alert('clubing 이용약관에 동의해야 합니다.');
      return; // 이용약관에 동의하지 않았으면 폼 제출을 중지합니다.
    }
    
    if (!privacy) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return; // 개인정보 수집 및 이용에 동의하지 않았으면 폼 제출을 중지합니다.
    }
    
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
    //이 코드는 category 배열을 객체 형태로 변환합니다. 배열의 각 요소가 main과 sub을 포함한 객체로 변환됩니다.
    // 언디파인드 대비해서 초기값 넣기
    const body = {
      email,
      password,
      name,
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
      termsAccepted: terms,
      privacyAccepted: privacy,
      marketingAccepted: marketing,
      image : `https://via.placeholder.com/600x400?text=no+user+image`
    }
   
  
    console.log('들어간 값 확인', body);

    dispatch(registerUser(body));

    // registerUser(body) thunk함수
    //dispatch 함수를 받아와서 액션을 전달할 수 있게 해줍니다. 
    //Redux를 사용하면 이 상태를 **하나의 전역 저장소(store)**에서 관리할 수 있게 됩니다.

    reset(); // 폼 초기화
  };
  
  //api
  const apiUrl = process.env.REACT_APP_API_URL;

  // 상태 정의
   const [homeLocation, setHomeLocation] = useState({ sido: '', sigoon: '', dong: '' });
   const [workplace, setWorkplace] = useState({ w_sido: '', w_sigoon: '', w_dong: '' });
   const [interestLocation, setInterestLocation] = useState({ i_sido: '', i_sigoon: '', i_dong: '' });

   // 성별 값 설정 함수
  const setGender = (value) => {
    setValue('gender', value);
  };
// register가 사용되지 않았지만 성별 값이 폼에 포함되는 이유는 setValue 함수와 watch 함수 덕분입니다.


  // 이메일 유효성 검사 규칙
  const userEmail = {
    required: "필수 필드입니다.",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "유효한 이메일 주소를 입력하세요."
    }
  };

  // 이름 유효성 검사 규칙
  const userName = {
    required: "필수 필드입니다.",
    maxLength: {
      value: 20,
      message: "최대 20자입니다."
    },
    pattern: {
      value: /^[^0-9]*$/,
      message: "숫자는 들어갈 수 없습니다."
    }
  };

  // 비밀번호 유효성 검사 규칙
  const userPassword = {
    required: "필수 필드입니다.",
    minLength: {
      value: 6,
      message: "최소 6자입니다."
    },validate: value => {
      // 비밀번호 유효성 검사 정규 표현식
       // 비밀번호 유효성 검사 정규 표현식
       const regex = /^(?=.*[a-zA-Z\u3131-\uD79D])(?=.*[\W_]).{6,}$/;
       if (!regex.test(value)) {
         return '안전한 비밀번호를 위해 영문 대/소문자, 특수문자 사용해 주세요.';
       }
       return true; // 유효성 검사 통과
    }
  };

  const userPasswordCheck = {
    required: 0,
    validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.'
  };

  // 연도, 월, 일을 위한 옵션 생성
  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i);
    }
    return options;
  };

// 생년월일 범주
  const years = generateOptions(1920, 2050);
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
// 직종
const [isJobPopupOpen, setIsJobPopupOpen] = useState(false); // 직종 팝업
const [selectedJobs, setSelectedJobs] = useState([]); 
//console.log("직업 데이터", selectedJobs)

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
  const grouped = groupCategories(selectedCategories);
  console.log("카테고리 확인", grouped);

  // grouped 데이터를 categoryData 형식으로 변환
  const categoryData = Object.keys(grouped).map(main => ({
    main: main,
    sub: grouped[main]
  }));

  setGroupedCategories(grouped); // 상태 업데이트
  setValue('category', categoryData); // 폼 데이터와 상태 동기화
  console.log("카테고리 확인222", categoryData);
}, [selectedCategories, setValue]);

// 직종
useEffect(() => {
  setValue('selectedJobs', selectedJobs);
  //console.log("선택된 직종:", selectedJobs);
}, [selectedJobs, setValue]);

  // 카테고리 선택 핸들러
  // ui 업데이트에 사용됨
 // 통합된 핸들러
 const handleSelection = (newSelections) => {
  if (isCategoryPopupOpen) {
    setSelectedCategories(newSelections); // 카테고리 선택 시 업데이트
  } else if (isJobPopupOpen) {
    setSelectedJobs(newSelections); // 직종 선택 시 업데이트
  }
};

//팝업 오픈
  const handlePopupOpen = (type) => {
    console.log("Popup type:", type);//
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

  // 이메일 중복 체크
  const emailValue = watch('email');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [authNumber, setAuthNumber] = useState('');

  const handleCheckDuplicate = async () => {
    // 이메일 주소가 null이거나 빈 문자열인 경우 처리
    if (!emailValue || emailValue.trim() === '') {
      alert('이메일 주소를 입력해주세요.'); // 사용자에게 이메일 입력을 요청하는 얼럿 표시
      return; // 오류가 있을 경우 함수 실행 중지
    }
    if (errors.email) {
      // 이메일 필드에 오류가 있을 경우 얼럿을 띄움
      alert('유효한 이메일 주소를 입력하세요.');
      return; // 오류가 있을 경우 함수 실행 중지
    }
    const email = emailValue;
    try {
      const response = await axios.post(`${apiUrl}/users/check-email`, { email });
      setMessage(response.data.message);
      setError('');
      setIsEmailChecked(true);  // 이메일 확인 후 버튼 상태 변경
    } catch (err) {
      setMessage('');
      setError(err.response ? err.response.data.message : '서버 오류');
      setIsEmailChecked(false);  // 오류 발생 시 버튼 상태 유지
    }
  };

//이메일 인증 보내기
const handleSendAuthEmail = async () => {
  try {
      const response = await axios.post(`${apiUrl}/users/email-auth`, { email: emailValue });
      console.log('API aaaa응답:', response.data);
      if (response.data.ok) {
        setCodeId(response.data.codeId); // 서버로부터 받은 codeId를 상태에 저장
        setAuthNumber(response.data.authNum); // 서버로부터 받은 인증번호를 상태에 저장
        setMessage('인증번호가 전송되었습니다.');
      } else {
          setError(response.data.msg);
      }
  } catch (err) {
    console.error('API 호출 오류:', err); // 오류 로그 추가
      setError('서버 오류');
  }
};

//인증 번호 확인
const [verificationCode, setVerificationCode] = useState('');
const [codeId, setCodeId] = useState(''); // 서버에서 받은 코드 ID
const [isVerified, setIsVerified] = useState(false); // 인증 여부 상태 추가
const [verifyError, setVerifyError] = useState('');

    const handleVerifyClick = async () => {
    
        try {
            const response = await axios.post(`${apiUrl}/users/verifyAuth`, {
                codeId,
                inputCode: verificationCode,
                email: emailValue 
            });

            if (response.data.ok) {
                // 인증 성공
                setIsVerified(true); 
                alert('인증에 성공하였습니다.');
                setVerifyError(''); // 인증 성공 시 에러 메시지 초기화
            } else {
                // 인증 실패
                setVerifyError(response.data.msg);
            }
        } catch (err) {
            console.error(err); // 오류 자세히 확인
            setVerifyError('인증번호가 틀렸습니다.');
        }
    }

/// 약관 동의 상태
const [isPopupOpen, setIsPopupOpen] = useState({
  all: false,
  terms: false,
  privacy: false,
  marketing: false,
});

// 체크박스 상태
const [checkboxState, setCheckboxState] = useState({
  terms: false,
  privacy: false,
  marketing: false,
  all: false
});

// 체크박스 상태를 업데이트하는 함수
const handleCheck = (type) => {
  setCheckboxState(prevState => {
    // 개별 체크박스의 상태를 반전시킵니다
    const newState = !prevState[type];
    // 모든 체크박스가 체크된 상태인지 확인합니다
    const allChecked = ['terms', 'privacy', 'marketing'].every(key => prevState[key]);
    return {
      ...prevState,
      [type]: newState,
      all: allChecked
    };
  });
};

// 전체 동의 상태를 업데이트
const handleAllCheck = () => {
  const newCheckedState = !checkboxState.all;
  setCheckboxState({
    terms: newCheckedState,
    privacy: newCheckedState,
    marketing: newCheckedState,
    all: newCheckedState
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
    <section className='flex flex-col justify-center mt-20 max-w-[400px] m-auto'>
      <div className='p-6 bg-white rounded-md shadow-md'>
        <h1 className='text-3xl font-semibold text-center'>
          회원가입
        </h1>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-800">
              이메일
            </label>
            <div className="flex flex-1 items-center">
            <input
            type="email"
            id="email"
            className={`flex-1 px-4 py-2 mt-2 border rounded-md ${
              isEmailChecked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'
            }`}
            readOnly={isEmailChecked}
            {...register('email' , userEmail)} // register 함수 적용 (이메일 유효성 검사 등을 위해)
            // ('email' , userEmail)여기서 'email' 와치가 이거보고 쓴뎅
        />
            <button
                type='button'
                className={`ml-2 px-4 py-2 rounded-md 
                ${isEmailChecked ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                onClick={isEmailChecked ? handleSendAuthEmail : handleCheckDuplicate}
              >
                {isEmailChecked ? '인증하기' : '중복검사'}
              </button>
            </div>
            {error && (
              <div>
                <span className="text-red-500">{error}</span>
              </div>
            )}
            {message && (
              <div>
                <span className="text-green-500">{message}</span>
              </div>
            )}
            {errors?.email && (
              <div>
                <span className='text-red-500'>{errors.email.message}</span>
              </div>
            )}
            {/* 유효성 통과 못 햇을 시 에러 메시지 */}
          </div>
{/* 인증번호 */}
        <div className="mb-2">
            <label htmlFor="verification" className="text-sm font-semibold text-gray-800">
              인증번호
            </label>
            <div className="flex flex-1 items-center">
            <input
              type="text"
              // input 태그에 type="email" 속성을 추가하면, 브라우저가 기본적으로 이메일 형식에 대한 유효성 검사를 수행합니다.
              id='verification'
              className={`flex-1 px-4 py-2 mt-2 border rounded-md ${
                isVerified ? 'bg-gray-200 text-gray-500' : 'bg-white'
            }`}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              readOnly={isVerified} // 인증 성공 시 읽기 전용
            />
            <button
                type='button'
                className={`ml-2 px-4 py-2 text-white rounded-md ${
                  isVerified ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
                onClick={handleVerifyClick}
                disabled={isVerified}
              >
                {isEmailChecked ? '인증확인' : '인증완료'}
              </button>
            </div>
            {verifyError && (
            <div>
                <span className='text-red-500'>{verifyError}</span>
            </div>
            )}
          </div>
{/* 비밀번호 */}
          <div className="mb-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-800">
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('password', userPassword)}
            />
            {errors?.password && (
              <div>
                <span className='text-red-500'>{errors.password.message}</span>
              </div>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-800">
              비밀번호 확인
            </label>
            <input
              type='password'
              id='passwordCheck'
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('passwordCheck', userPasswordCheck)}
            />
            {errors?.passwordCheck && (
              <div>
                <span className='text-red-500'>{errors.passwordCheck.message}</span>
              </div>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-800">
              이름
            </label>
            <input
              type='text'
              id='name'
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('name', userName)}
              // 유효성 검사 및 저장
            />
            {errors?.name && (
              <div>
                <span className='text-red-500'>{errors.name.message}</span>
              </div>
            )}
          </div>
{/*생년월일 */}
<div className="mb-2">
        <label htmlFor="age" className="text-sm font-semibold text-gray-800">
          생년월일
        </label>
        <div className="flex gap-4 mt-2">
          {/* 생년 */}
          <div className="flex-1">
            <select
              id="year"
              className="w-full px-4 py-2 bg-white border rounded-md"
              {...register('age.year', {
                required: '출생년도는 필수입니다.',
              })}
            >
              <option value="">선택</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors?.age?.year && (
              <div>
                <span className="text-red-500">{errors.age.year.message}</span>
              </div>
            )}
          </div>

          {/* 월 */}
          <div className="flex-1">
            <select
              id="month"
              className="w-full px-4 py-2 bg-white border rounded-md"
              {...register('age.month', {
                required: '월은 필수입니다.',
              })}
            >
              <option value="">선택</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors?.age?.month && (
              <div>
                <span className="text-red-500">{errors.age.month.message}</span>
              </div>
            )}
          </div>

          {/* 일 */}
          <div className="flex-1">
            <select
              id="day"
              className="w-full px-4 py-2 bg-white border rounded-md"
              {...register('age.day', {
                required: '일은 필수입니다.',
              })}
            >
              <option value="">선택</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {errors?.age?.day && (
              <div>
                <span className="text-red-500">{errors.age.day.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
{/* 성별 선택 버튼 */}
    <div className="mb-2">
        <label htmlFor="gender" className="text-sm font-semibold text-gray-800">성별</label>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md ${watch('gender') === '남성' ? 'bg-blue-700' : ''}`}
            onClick={() => setGender('남성')}
            {...register('gender')} 
          >
            남자
          </button>
          <button
            type="button"
            className={`w-full px-4 py-2 bg-pink-500 text-white rounded-md ${watch('gender') === '여성' ? 'bg-pink-700' : ''}`}
            onClick={() => setGender('여성')}
            {...register('gender')} 
          >
            여자
          </button>
        </div>
        {errors?.gender && <span className="text-red-500">{errors.gender.message}</span>}
      </div>
{/* 전화번호 */}
<div className="mb-2">
  <label htmlFor="phone" className="text-sm font-semibold text-gray-800">
    전화번호
  </label>
  <div className="mt-2">
    <input
      type="text"
      id="phone"
      className="w-full px-4 py-2 bg-white border rounded-md"
      placeholder="010-7430-3504"
      {...register('phone', {
        required: '전화번호는 필수입니다.',
        pattern: {
          value: /^\d{3}-\d{4}-\d{4}$/, // 예: 010-7430-3504
          message: '전화번호 형식을 확인해 주세요.\n 예) 010-7430-3504',
        }
      })}
    />
    {errors.phone && (
      <div>
        <span className="text-red-500">{errors.phone.message}</span>
      </div>
    )}
  </div>
</div>
{/*집주소 */}
<div>
      <div className="flex items-center mt-2">
        <h1 className="text-sm font-semibold text-gray-800">집주소</h1>
        <h3 className="text-sm font-normal ml-2">(*동을 입력해주세요)</h3>
      </div>
      <HomeSearch 
        setSelectedSido={(sido) => setHomeLocation(prev => ({ ...prev, sido }))} 
        setSelectedSigoon={(sigoon) => setHomeLocation(prev => ({ ...prev, sigoon }))} 
        setSelectedDong={(dong) => setHomeLocation(prev => ({ ...prev, dong }))} />
{/*직장 */}
      <div className="flex items-center mt-2">
        <h1 className="text-sm font-semibold text-gray-800">직장위치</h1>
        <h3 className="text-sm font-normal ml-2">(*동을 입력해주세요)</h3>
      </div>
      <WorkplaceSearch 
        setWorkplaceSido={(sido) => setWorkplace(prev => ({ ...prev, w_sido: sido }))} 
        setWorkplaceSigoon={(sigoon) => setWorkplace(prev => ({ ...prev, w_sigoon: sigoon }))} 
        setWorkplaceDong={(dong) => setWorkplace(prev => ({ ...prev, w_dong: dong }))} />
{/*관심지역 */}
      <div className="flex items-center mt-2">
        <h1 className="text-sm font-semibold text-gray-800">관심지역</h1>
        <h3 className="text-sm font-normal ml-2">(*동을 입력해주세요)</h3>
      </div>
      <InterestSearch 
        setInterestSido={(sido) => setInterestLocation(prev => ({ ...prev, i_sido: sido }))} 
        setInterestSigoon={(sigoon) => setInterestLocation(prev => ({ ...prev, i_sigoon: sigoon }))} 
        setInterestDong={(dong) => setInterestLocation(prev => ({ ...prev, i_dong: dong }))} />
    </div>
{/*직종 */}
<div className="mt-2">
<div className="mb-2">
        {/* 버튼 */}
        <button
          type="button"
          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          onClick={() => handlePopupOpen('job')}
        >
          직종 선택
        </button>

        <label htmlFor="Category" className="text-sm font-semibold text-gray-800"
        type='text'
        >
        (최대 3개 선택 가능)
        </label>
      </div>

      {isJobPopupOpen && (
       <JobPopup
          jobCategories={JobCategories} // 여기를 확인해봐야 합니다
          onSelect={handleSelection}
          onClose={() => handlePopupClose('job')}
          selectedJobs={selectedJobs}// 선택된 카테고리 전달
        />
      )}
      
      {/* 선택된 카테고리 리스트 표시 */}
      <div className="mt-2 mb-4">
        <h3 className="text-sm font-semibold">선택된 직종</h3>
        <ul className="flex flex-wrap gap-2">
          {selectedJobs.map((job, index) => (
            <li
              key={index}
              className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300"
            >
              {job}
            </li>
          ))}
        </ul>
      </div>
    </div>
{/*카테고리 */}
<div className="">
<div className="mb-2">
        {/* 버튼 */}
        <button
          type="button"
          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          onClick={() => handlePopupOpen('category')}
        >
          카테고리 선택
        </button>

        <label htmlFor="Category" className="text-sm font-semibold text-gray-800"
        type='text'
        >
        3개 이상 선택해 주세요
        </label>
      </div>

      {isCategoryPopupOpen && (
        <CategoryPopup 
          categories={categories} 
          onSelect={handleSelection}
          onClose={() => handlePopupClose('category')}
          selectedCategories={selectedCategories} // 선택된 카테고리 전달
        />
      )}
      
      {/* 선택된 카테고리 리스트 표시 */}
      <div className="mt-2">
        <h3 className="text-sm font-semibold">선택된 카테고리</h3>
        <ul>
          {Object.entries(groupedCategories).map(([main, subs]) => (
            <li key={main} className="mb-2">
              <h4 className="font-semibold">{main}</h4>
              <ul className="flex flex-wrap gap-2">
                {subs.map((sub, index) => (
                  <li key={index} className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300">
                    {sub}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
{/*약관 동의 */}
{/* 동의 항목 */}
<div className="mt-4">
    <div className="mb-2">
      <label className="flex flex-col">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={checkboxState.all}
            onChange={handleAllCheck}
            className="mr-2"
          />
          <h2 className="text-lg font-semibold">전체 동의하기</h2>
        </div>
        <span
          className="text-gray-600 mt-2" // Margin to space out from the title
          style={{
            boxSizing: 'border-box',
            maxHeight: '100px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #d6d6d6',
          }}
        >
          실명 인증된 아이디로 가입, 위치기반서비스 이용약관(선택), 이벤트・혜택 정보 수신(선택) 동의를 포함합니다.
        </span>
      </label>
    </div>
{/* clubing 이용약관 */}
      <div className="mb-2">
        <label htmlFor="terms-checkbox" className="flex items-center">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={checkboxState.terms}
            onChange={() => handleCheck('terms')}
            className="mr-2"
          />
          [필수] clubing 이용약관
          <button
            type="button"
            onClick={() => consentPopupOpen('terms')}
            className="ml-2 text-blue-500 underline"
          >
            전체
          </button>
        </label>
      </div>
{/* 개인정보 */}
    <div className="mb-2">
      <label htmlFor="privacy-checkbox" className="flex items-center">
        <input
          type="checkbox"
          id="privacy-checkbox" // id를 추가하여 고유하게 식별
          checked={checkboxState.privacy}
          onChange={() => handleCheck('privacy')} // 상태 변경 핸들러
          className="mr-2" // 스타일링
        />
        [필수] 개인정보 수집 및 이용
        <button
          type="button"
          onClick={() => consentPopupOpen('privacy')} // 동의 팝업 열기 핸들러
          className="ml-2 text-blue-500 underline" // 스타일링
        >
          전체
        </button>
      </label>
    </div>
{/* 마케팅 동의 */}
        <div className="mb-2">
          <label htmlFor="marketing-checkbox" className="flex items-center">
            <input
              type="checkbox"
              id="marketing-checkbox"
              checked={checkboxState.marketing}
              onChange={() => handleCheck('marketing')}
              className="mr-2"
            />
            [선택] 마케팅 동의
            <button
              type="button"
              onClick={() => consentPopupOpen('marketing')}
              className="ml-2 text-blue-500 underline"
            >
              전체
            </button>
          </label>
        </div>
      </div>

      {/* 팝업 모달 */}
      {isPopupOpen.terms && (
        <TermsPopup onClose={() => consentPopupClose('terms')} 
        handleCheck={handleCheck}
        checked={{ terms: checkboxState.terms }}
        />
      )}
      {isPopupOpen.privacy && (
        <PrivacyPopup onClose={() => consentPopupClose('privacy')} 
        handleCheck={handleCheck}
        checked={{ privacy: checkboxState.privacy }}
        />
      )}
      {isPopupOpen.marketing && (
        <MarketingPopup onClose={() => consentPopupClose('marketing')} 
        handleCheck={handleCheck}
        checked={{ marketing: checkboxState.marketing }}
        />
      )}
{/*회원가입 버튼 */}
          <div className='mt-6'>
            <button type='submit' className='w-full px-4 py-2 text-white duration-200 bg-black rounded-md hover:bg-gray-700'>
              회원가입
            </button>
          </div>
          <p className='mt-8 text-xs font-light text-center text-gray-700'>
            아이디가 있다면?{" "}
            <a href='/login' className='font-medium hover:underline'>
              로그인
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;