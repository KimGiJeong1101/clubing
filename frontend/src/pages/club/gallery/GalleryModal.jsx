import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageCarousel from '../../../components/common/ImageCarousel'; 

const GalleryModal = ({ open, handleClose, images, title, handlePrev, handleNext }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // 어두운 배경 설정
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // 모달 창의 전체 너비
          height: '600px', // 고정된 높이 설정
          maxWidth: '100%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: '8px',
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: '-130px', // 모달 창 밖으로 위치시키기 위해 음수 값 적용
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1300,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>

        <Box
          sx={{
            width: '50%', // 왼쪽 영역의 너비 고정
            height: '100%', // 모달 창의 고정된 높이에 맞춤
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center', // 이미지 가운데 정렬
            overflow: 'hidden', // 이미지가 박스를 벗어나지 않도록 설정
          }}
        >
          <ImageCarousel images={images} /> {/* 캐러셀을 이곳에 렌더링 */}
        </Box>

        <Box sx={{ width: '50%', height: '100%', p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              padding: '10px',
              position: 'relative',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: '-10px',
                left: '10px',
                backgroundColor: 'white',
                padding: '0 4px',
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              Title
            </Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>

          {/* Content 부분 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              padding: '10px',
              position: 'relative',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: '-10px',
                left: '10px',
                backgroundColor: 'white',
                padding: '0 4px',
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              Content
            </Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid grey',
              borderRadius: '8px',
              flexGrow: 1, // 댓글 영역을 남은 공간에 맞추기 위해 사용
              overflowY: 'auto', // 댓글이 많을 경우 스크롤 가능하도록 설정
            }}
          >
            <Typography variant="h6" component="h3" sx={{ marginBottom: 1 }}>
              Comments
            </Typography>
            {/* 여기에 댓글 목록을 추가하세요 */}
          </Box>
        </Box>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: '-130px', // 모달 창 밖으로 위치시키기 위해 음수 값 적용
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1300,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default GalleryModal;
