import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';

const MyClub = () => {
  // 클릭된 항목을 추적하는 상태
  const [activeItem, setActiveItem] = useState('myGroups');

  // 항목 클릭 핸들러
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* 내 정보 리스트 */}
      <Box
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', // 버튼 사이에 동일한 간격을 줍니다.
          mb: 0, // 마진을 없애서 경계 제거
          borderBottom: '1px solid #ddd', // 버튼과 콘텐츠 사이에 경계선 추가 (선택 사항)
        }}
      >
        {['myGroups', 'savedGroups', 'recentGroups', 'invitedGroups'].map((item) => (
          <Box
            key={item}
            sx={{ 
              flex: 1, // 각 버튼이 동일한 비율로 차지하도록 설정
              textAlign: 'center', 
              cursor: 'pointer', 
              position: 'relative', // 밑줄을 절대 위치로 설정하기 위해
              p: 3, 
              borderRadius: 2,
              transition: 'background-color 0.3s, transform 0.3s',
              backgroundColor: activeItem === item ? '#e0e0e0' : 'transparent',
              transform: activeItem === item ? 'scale(1.05)' : 'scale(1)',
              '&:hover': {
                backgroundColor: activeItem !== item ? '#f0f0f0' : 'transparent', // 클릭되지 않은 항목만 호버 효과
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: activeItem === item ? '70%' : '0%', // 클릭된 버튼만 밑줄을 가득 채우도록 설정
                height: '3px',
                backgroundColor: '#40190B', // 밑줄 색상
                transform: 'translateX(-50%)', // 가운데 정렬
                transition: 'width 0.3s ease',
              }
            }}
            onClick={() => handleItemClick(item)}
          >
            <Typography variant="body1">
              {item === 'myGroups' && '내 모임'}
              {item === 'savedGroups' && '찜 모임'}
              {item === 'recentGroups' && '최근 본 모임'}
              {item === 'invitedGroups' && '초대받은 모임'}
            </Typography>
            <Typography variant="body2">
              {item === 'myGroups' && '0'}
              {item === 'savedGroups' && '0'}
              {item === 'recentGroups' && '4'}
              {item === 'invitedGroups' && '0'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 콘텐츠 영역 */}
      <Box
        sx={{
          p: 3,
          bgcolor: activeItem ? '#e0e0e0' : 'white', // activeItem이 있는 경우 회색으로 변경
          borderRadius: 2,
          boxShadow: 3,
          transition: 'background-color 0.3s ease',
          mt: -1, // 콘텐츠 영역이 버튼 영역에 붙도록 조정
        }}
      >
        {activeItem === 'myGroups' && (
          <Typography variant="h6" align="center">
            내 모임 콘텐츠
          </Typography>
        )}
        {activeItem === 'savedGroups' && (
          <Typography variant="h6" align="center">
            찜 모임 콘텐츠
          </Typography>
        )}
        {activeItem === 'recentGroups' && (
          <Typography variant="h6" align="center">
            최근 본 모임 콘텐츠
          </Typography>
        )}
        {activeItem === 'invitedGroups' && (
          <Typography variant="h6" align="center">
            초대받은 모임 콘텐츠
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MyClub;
