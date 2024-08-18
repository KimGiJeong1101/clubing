import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Box, Button, Typography, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const JobPopup = ({ jobCategories, onSelect, onClose, selectedJobs }) => {
  // 현재 선택된 직무 상태 관리
  const [localSelectedJobs, setLocalSelectedJobs] = useState(selectedJobs);
  const [error, setError] = useState('');

  // 직무 선택/해제 핸들러
  const handleSelect = (job) => {
    // 직무가 이미 선택된 상태인지 확인
    const isSelected = localSelectedJobs.includes(job);

    if (isSelected) {
      // 직무가 선택된 상태라면 제거
      setLocalSelectedJobs(prev => prev.filter(selectedJob => selectedJob !== job));
    } else {
      // 직무가 선택되지 않은 상태라면 추가
      if (localSelectedJobs.length < 3) { // 최대 3개 선택 가능
        setLocalSelectedJobs(prev => [...prev, job]);
        setError('');
      } else {
        setError('최대 3개의 직무만 선택할 수 있습니다.');
      }
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleSubmit = () => {
    onSelect(localSelectedJobs); // 선택된 직무를 부모 컴포넌트에 전달
    onClose(); // 팝업 닫기
  };

  // 팝업 닫기 핸들러
  const handleClose = (e) => {
    e.stopPropagation();
    onClose(); // 팝업 닫기
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // MUI의 Dialog가 사용하는 zIndex
      }}
      onClick={handleClose}
    >
      <Draggable>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 600,
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* X 버튼 */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            직무 선택
          </Typography>

          {/* 에러 메시지 */}
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}

          {/* 직무 리스트 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {jobCategories.map(job => (
              <Button
                key={job}
                variant={localSelectedJobs.includes(job) ? 'contained' : 'outlined'}
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(job); // 직무 문자열을 직접 전달
                }}
              >
                {job}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              확인
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Draggable>
    </Box>
  );
};

export default JobPopup;
