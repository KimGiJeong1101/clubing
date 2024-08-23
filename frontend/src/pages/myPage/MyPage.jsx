import MyUpdate from './sections/MyUpdate'; // MyUpdate 컴포넌트를 임포트합니다.
import MyChat from './sections/MyChat';
import MyList from './sections/MyList';
import MySetting from './sections/MySetting';
import MyWish from './sections/MyWish';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // Camera 아이콘
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘
import BrushIcon from '@mui/icons-material/Brush';
import { Box, Typography, Avatar, Divider, IconButton, Modal, Popover, MenuItem } from '@mui/material';
import { myPage } from '../../store/actions/userActions';
import axiosInstance from "../../utils/axios";


const MyPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.userData);

  //이미지 확인 모달창 열기
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const [profileImage, setProfileImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Popover 상태 관리

  console.log('오리진 이미지', user?.profilePic?.originalImage);
  useEffect(() => {
    dispatch(myPage()); // 사용자 데이터 새로고침
  }, [dispatch]);

  //이미지 확인 모달창 열기
  const handleOpen = (src) => {
    setImageSrc(src);
    setOpen(true);
  };
  //이미지 확인 모달창 닫기
  const handleClose = () => setOpen(false);

  // Popover 열기 및 닫기
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };
////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정
const handleEditClick = async () => {
  document.getElementById('profileUpload').click(); // 파일 선택 창 열기
  handleClosePopover();

  const fileInput = document.getElementById('profileUpload');
  fileInput.addEventListener('change', async () => {
      const selectedFile = fileInput.files[0]; // 선택된 파일

      if (selectedFile) {
          const formData = new FormData();
          formData.append('image', selectedFile); // 파일을 FormData에 추가
          try {
              await axiosInstance.put('/users/profile/image', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data' // 요청 헤더 설정
                  }
              });
              dispatch(myPage()); // 데이터 새로고침
              alert('이미지가 성공적으로 수정되었습니다.');
            } catch (error) {
              // 오류 처리
              if (error.response) {
                  // 서버가 응답을 보냈으나 상태 코드가 오류인 경우
                  console.error('서버 응답 오류:', error.response.data);
                  alert(`이미지 수정에 실패했습니다. 오류: ${error.response.data.message || '알 수 없는 오류'}`);
              } else if (error.request) {
                  // 서버에 요청을 보냈으나 응답이 없는 경우
                  console.error('서버 응답 없음:', error.request);
                  alert('이미지 수정 요청이 서버에 도달하지 않았습니다. 네트워크를 확인해 주세요.');
              } else {
                  // 요청 설정 중 오류가 발생한 경우
                  console.error('요청 설정 오류:', error.message);
                  alert(`이미지 수정 요청 중 오류가 발생했습니다: ${error.message}`);
              }
          }
      }
  }, { once: true }); // 이벤트 리스너는 한 번만 실행되도록 설정
};
////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정////////////////////////////////////////////////// 이미지 수정
  
////////////////////////////////////////////////// 이미지 삭제 ////////////////////////////////////////////////// 이미지 삭제////////////////////////////////////////////////// 이미지 삭제
const handleDeleteClick = async () => {
  // 콘솔에 메시지를 출력하고 팝오버를 닫습니다.
  console.log('삭제하기 클릭');
  handleClosePopover();

  // 이미지 삭제 작업을 시도합니다.
  try {
    // 서버에 DELETE 요청을 보내 이미지 삭제를 시도합니다.
    const response = await axiosInstance.delete('/users/profile/image_del'); // 서버 URL 확인
    
    // 서버로부터의 응답을 기반으로 성공 메시지를 표시합니다.
    if (response.status === 200) {
      // 상태 새로 고침
      await dispatch(myPage()); // 데이터 새로 고침이 완료되도록 await
      alert('이미지가 성공적으로 삭제되었습니다.');
    } else {
      alert('이미지 삭제에 실패했습니다.');
    }
  } catch (error) {
    // 오류가 발생했을 때 콘솔에 에러를 출력하고 사용자에게 알립니다.
    console.error('이미지 삭제 중 오류 발생:', error);
    alert('이미지 삭제에 실패했습니다.');
  }
};
////////////////////////////////////////////////// 이미지 삭제////////////////////////////////////////////////// 이미지 삭제////////////////////////////////////////////////// 이미지 삭제
// 이미지 미리보기 모달
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Box 
    sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        mt: 6, 
        maxWidth: 600, 
        mx: 'auto' }}>
     {/* 프로필 헤더 */}
     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative' }}>
      {/* 프로필 이미지 */}
      <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{ width: 100, height: 100, cursor: 'pointer' }}
            src={user?.profilePic?.thumbnailImage || ''}
            onClick={() => handleOpen( user?.profilePic?.originalImage || '')}
          />

      <Box sx={{ position: 'relative' }}>
            {/* 이미지 수정 버튼 */}
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                borderRadius: '50%',
                width: 30,
                height: 30,
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'grey.200',
                },
              }}
              onClick={handleClick} // 이미지 수정 버튼 클릭 시 호출
            >
              <CameraAltIcon />
            </IconButton>

            {/* 수정 삭제 선택 */}
            <Popover
              open={Boolean(openPopover)}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              sx={{
                '& .MuiPopover-paper': {
                  borderRadius: '15px',
                  border: '1px solid #A9A9A9',
                  bgcolor: '#D3D3D3',
                  p: 1,
                  marginLeft : 4
                },
              }}
            >
             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MenuItem onClick={handleEditClick}>
                <BrushIcon sx={{ mr: 1 }} />
                수정하기
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <DeleteIcon sx={{ mr: 1 }} />
                삭제하기
              </MenuItem>
            </Box>
            </Popover>
          </Box>
        </Box>

      {/* 이미지와 정보 사이 여백 */}
      <Box sx={{ ml: 3 }}>
        <Typography variant="h6">{user?.name || ''}</Typography>
        <Typography variant="body2" color="textSecondary">
          {user?.homeLocation 
            ? `${user.homeLocation.city || ''} `
            : '거주지 정보 없음'}
          •  {/* 가운데 점 */}
          {'  '}
          {user?.age 
            ? `${user.age.year || ''}년 ${user.age.month || ''}월 ${user.age.day || ''}일` 
            : '나이 정보 없음'}
          </Typography>  
             {/* Category Section */}
             <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2}}>
                {user?.category?.map((cat, index) => (
                  cat.sub && cat.sub.length > 0 && (
                    <Box key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1, // Padding X-axis 줄이기
                      py: 0.5, // Padding Y-axis 줄이기
                      bgcolor: '#D3D3D3', // 라이트 그레이 색상
                      color: 'black', // 텍스트 색상
                      borderRadius: '15px', // 둥근 모서리
                      border: '1px solid', 
                      borderColor: '#A9A9A9', // 테두리 색상
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.875rem', // 폰트 크기 줄이기
                      '&:hover': {
                        bgcolor: '#C0C0C0', // 호버 시 색상 변경
                        borderColor: '#808080', // 호버 시 테두리 색상
                      }
                      }}>
                      <Typography variant="body2">
                        {cat.sub.join(', ')}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </Box>
        


         {/* 이미지 수정 버튼 */}
         <input
             accept="image/*"
             type="file"
             style={{ display: 'none' }}
             id="profileUpload"
             onChange={handleImageChange}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bgcolor: 'background.paper',
              borderRadius: '50%',
              width: 30,
              height: 30,
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
            onClick={() => document.getElementById('profileUpload').click()}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />

      {/* 프로필 소개 */}
      {user?.profilePic.introduction && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">{user.profilePic.introduction}</Typography>
      </Box>
)}
      {/* 내 정보 리스트 */}
      <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: 2 
      }}
    >
      {/* 내 정보 리스트 */}
      <Box
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', // 항목 사이에 동일한 간격을 줍니다.
          mb: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">찜 모임</Typography>
          <Typography variant="body2">0</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">최근 본 모임</Typography>
          <Typography variant="body2">4</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">초대받은 모임</Typography>
          <Typography variant="body2">0</Typography>
        </Box>
      </Box>
      <Divider />
    </Box>

      {/* 추가 섹션 */}
      <MyChat />
      <MyList />
      <MySetting />
      <MyUpdate />
      <MyWish />

{/* 프로필 사진 모달 */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={imageSrc}
            alt="Profile"
            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default MyPage;
