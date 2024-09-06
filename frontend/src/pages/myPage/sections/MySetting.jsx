import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const MySetting = () => {
  // 상태 관리
  const [view, setView] = useState('');

  // 버튼 클릭 시 상태 업데이트
  const handleButtonClick = (section) => {
    setView(view === section ? '' : section);
  };

  return (
    <Box
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        maxWidth: 600, 
        mx: 'auto' 
      }}
    >
      {/* 버튼들 */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* 공지사항 버튼 */}
        <Button
          variant={view === 'notice' ? 'contained' : 'outlined'}
          onClick={() => handleButtonClick('notice')}
          sx={{ 
            position: 'relative',
            backgroundColor: view === 'notice' ? '#e0e0e0' : 'transparent',
            color: '#30231C',
            '&:hover': {
              backgroundColor: view === 'notice' ? '#d0d0d0' : 'transparent'
            },
            textAlign: 'left',
            paddingLeft: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mb: 1,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: view === 'notice' ? '100%' : '0%',
              height: '2px',
              backgroundColor: '#595959',
              transform: 'translateX(-50%)',
              transition: 'width 0.3s ease',
            },
          }}
        >
          공지사항
        </Button>
        {/* 공지사항 내용 */} 
        {view === 'notice' && (
          <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" component="h2" align="center">
              공지사항
            </Typography>
            {/* 공지사항 내용 */}
            <Typography variant="body1" align="center" mt={2}>
              여기에 공지사항 내용을 추가하세요.
            </Typography>
          </Box>
        )}

        {/* 고객센터 버튼 */}
        <Button
          variant={view === 'support' ? 'contained' : 'outlined'}
          onClick={() => handleButtonClick('support')}
          sx={{ 
            position: 'relative',
            backgroundColor: view === 'support' ? '#e0e0e0' : 'transparent',
            color: '#30231C',
            '&:hover': {
              backgroundColor: view === 'support' ? '#d0d0d0' : 'transparent'
            },
            textAlign: 'left',
            paddingLeft: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mb: 1,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: view === 'support' ? '100%' : '0%',
              height: '2px',
              backgroundColor: '#595959',
              transform: 'translateX(-50%)',
              transition: 'width 0.3s ease',
            },
          }}
        >
          고객센터
        </Button>
        {/* 고객센터 내용 */} 
        {view === 'support' && (
          <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" component="h2" align="center">
              고객센터
            </Typography>
            {/* 고객센터 내용 */}
            <Typography variant="body1" align="center" mt={2}>
              여기에 고객센터 정보를 추가하세요.
            </Typography>
          </Box>
        )}

        {/* 자주 묻는 질문 버튼 */}
        <Button
          variant={view === 'faq' ? 'contained' : 'outlined'}
          onClick={() => handleButtonClick('faq')}
          sx={{ 
            position: 'relative',
            backgroundColor: view === 'faq' ? '#e0e0e0' : 'transparent',
            color: '#30231C',
            '&:hover': {
              backgroundColor: view === 'faq' ? '#d0d0d0' : 'transparent'
            },
            textAlign: 'left',
            paddingLeft: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: view === 'faq' ? '100%' : '0%',
              height: '2px',
              backgroundColor: '#595959',
              transform: 'translateX(-50%)',
              transition: 'width 0.3s ease',
            },
          }}
        >
          자주 묻는 질문
        </Button>
        {/* 자주 묻는 질문 내용 */}
        {view === 'faq' && (
          <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" component="h2" align="center">
              자주 묻는 질문
            </Typography>
            {/* 자주 묻는 질문 내용 */}
            <Typography variant="body1" align="center" mt={2}>
              여기에 자주 묻는 질문과 답변을 추가하세요.
            </Typography>
          </Box>
        )}
      </Box>   
    </Box>
  );
}

export default MySetting;
