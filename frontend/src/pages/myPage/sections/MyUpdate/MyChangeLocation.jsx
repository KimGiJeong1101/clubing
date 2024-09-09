import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // 추가: useNavigate 훅을 가져옵니다.
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logoutUser } from '../../../../store/actions/userActions'
import HomeSearch from '../../../auth/RegisterPage/address/HomeSearch';
import WorkplaceSearch from '../../../auth/RegisterPage/address/WorkplaceSearch';
import InterestSearch from '../../../auth/RegisterPage/address/InterestSearch';
import axiosInstance from '../../../../utils/axios'
import { Typography, Box, 
        } from '@mui/material';
import '../../../../assets/styles/LoginCss.css'
import CustomButton2 from '../../../../components/club/CustomButton2.jsx'

const MyChangeLocation = ({ view }) => {
  const user = useSelector((state) => state.user?.userData?.user || {});
  const { register, handleSubmit, formState: { errors }, setValue  } = 
  useForm({  
            defaultValues: {
              homeLocation: user.homeLocation || { city: '', district: '', neighborhood: '' },
              workplace: user.workplace || { city: '', district: '', neighborhood: '' },
              interestLocation: user.interestLocation || { city: '', district: '', neighborhood: '' },
            },
            mode: 'onChange'});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 정보수정 폼 제출 시 실행되는 함수
  const onSubmit = async (data) => {
    const { sido = '', sigoon = '', dong = '' } = homeLocation;
    const { w_sido = '', w_sigoon = '', w_dong = '' } = workplace;
    const { i_sido = '', i_sigoon = '', i_dong = '' } = interestLocation;
  
    const body = {
      email: user.email,  // 이메일 추가
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
    }

    try {
      const response = await axiosInstance.post('/users/update-location', body);
      if (response.data.ok) {
        alert('위치 정보가 업데이트되었습니다.');
        navigate('/'); // 성공 페이지로 리다이렉트
      } else {
        alert('업데이트 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('위치 정보 업데이트 오류:', error);
      alert('위치 정보 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 상태 정의
   const [homeLocation, setHomeLocation] = useState({ sido: '', sigoon: '', dong: '' });
   const [workplace, setWorkplace] = useState({ w_sido: '', w_sigoon: '', w_dong: '' });
   const [interestLocation, setInterestLocation] = useState({ i_sido: '', i_sigoon: '', i_dong: '' });

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

  return (
    <Box 
      sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          width: 400, 
          mx: 'auto' }}>
      {/*집주소 */}
      <Typography variant="body2" component="label" htmlFor="nickName" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 2, // 패딩 추가
          border: '1px solid #ccc', // 구분선 추가
          borderRadius: '20px', // 둥근 모서리
          textAlign: 'center', // 가운데 정렬
          backgroundColor: '#E8E4D8' // 배경색 추가 (연한 회색)
          }}>
           집 주소 : {user.homeLocation ? `${user.homeLocation.city} ${user.homeLocation.district} ${user.homeLocation.neighborhood}` : '정보 없음'}
      </Typography>  
      {view === 'changeLocation' && (
      <Box mb={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
          변경할 집 주소
          </Typography>
            <HomeSearch 
              setSelectedSido={(sido) => setHomeLocation(prev => ({ ...prev, sido }))} 
              setSelectedSigoon={(sigoon) => setHomeLocation(prev => ({ ...prev, sigoon }))} 
              setSelectedDong={(dong) => setHomeLocation(prev => ({ ...prev, dong }))} />
        </Box>
      {/*직장 */}
      <Typography variant="body2" component="label" htmlFor="nickName" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 2, // 패딩 추가
          border: '1px solid #ccc', // 구분선 추가
          borderRadius: '20px', // 둥근 모서리
          textAlign: 'center', // 가운데 정렬
          backgroundColor: '#E8E4D8' // 배경색 추가 (연한 회색)
          }}>
          직장 주소 :  {user.workplace ? `${user.workplace.city} ${user.workplace.district} ${user.workplace.neighborhood}` : '정보 없음'}
      </Typography>  
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
            변경할 직장 주소
          </Typography>
            <WorkplaceSearch 
              setWorkplaceSido={(sido) => setWorkplace(prev => ({ ...prev, w_sido: sido }))} 
              setWorkplaceSigoon={(sigoon) => setWorkplace(prev => ({ ...prev, w_sigoon: sigoon }))} 
              setWorkplaceDong={(dong) => setWorkplace(prev => ({ ...prev, w_dong: dong }))} />    
      </Box>
      {/*관심지역 */}
      <Typography variant="body2" component="label" htmlFor="nickName" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 2, // 패딩 추가
          border: '1px solid #ccc', // 구분선 추가
          borderRadius: '20px', // 둥근 모서리
          textAlign: 'center', // 가운데 정렬
          backgroundColor: '#E8E4D8' // 배경색 추가 (연한 회색)
          }}>
        관심 지역 : {user.interestLocation ? `${user.interestLocation.city} ${user.interestLocation.district} ${user.interestLocation.neighborhood}` : '정보 없음'}
      </Typography>  
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" component="label" htmlFor="nickName" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: 100 }}>
        변경할 관심 지역
          </Typography>
            <InterestSearch 
              setInterestSido={(sido) => setInterestLocation(prev => ({ ...prev, i_sido: sido }))} 
              setInterestSigoon={(sigoon) => setInterestLocation(prev => ({ ...prev, i_sigoon: sigoon }))} 
              setInterestDong={(dong) => setInterestLocation(prev => ({ ...prev, i_dong: dong }))} />
        </Box>
        <CustomButton2
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ mt: 2,
              width: 400, 
            }}
          >
            지역 변경
          </CustomButton2>
      </Box>
      )}  
    </Box>
  );
};

export default MyChangeLocation