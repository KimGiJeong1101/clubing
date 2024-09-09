import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../utils/axios';
import ClubCard from '../../../../components/club/ClubCard'; // ClubCard 컴포넌트 경로를 맞추세요
import ClubCarousel from '../../../../components/club/ClubCarousel'; 

const MyGroups = () => {
    const user = useSelector((state) => state.user?.userData?.user || {});
    const [clubs, setClubs] = useState([]); // 클럽 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        // 사용자 클럽 데이터를 가져오는 API 요청
        const fetchUserClubs = async () => {
          try {
            // 유저의 클럽 데이터를 가져오기 위한 API 호출
            const response = await axiosInstance.get('/users/myPage'); 
            const userClubs = response.data.user.clubs;
    
            // 클럽 목록을 가져오기 위한 API 호출
            const clubResponses = await Promise.all(
              userClubs.map(clubId => axiosInstance.get(`/clubs/read/${clubId}`))
            );
            const clubsData = clubResponses.map(response => response.data);
    
            setClubs(clubsData); // 클럽 데이터 상태 업데이트
            setLoading(false); // 로딩 완료
          } catch (error) {
            console.error("Error fetching clubs:", error);
            setLoading(false); // 에러 발생 시 로딩 종료
          }
        };
    
        fetchUserClubs();
    }, [user.email]); // 의존성 배열에 user.email 추가

    return (
        <Box>
        <Typography variant="h6" align="center"
         sx={{
            p: 3,
            mt: -1, // 콘텐츠 영역이 버튼 영역에 붙도록 조정
          }}
        >
            뭐라고 적냐
        </Typography>
        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        ) : (
            <ClubCarousel clubList={clubs} /> // 클럽 리스트를 ClubCarousel 컴포넌트에 전달
            )}
        </Box>
    );
};

export default MyGroups;
