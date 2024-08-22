import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// 스타일 객체 정의
const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // 수직 중앙 정렬
  zIndex: 1000, // 다른 요소 위에 표시되도록
};

const modalContentStyles = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: '852px', // 고정 너비
  height: '230px', // 고정 높이
  overflow: 'hidden', // 넘치는 내용 숨기기
  position: 'relative', // 버튼의 절대 위치 설정을 위한 상대 위치
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  padding: '10px 20px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// 이미지 크롭퍼 컴포넌트
const ImageCropper = ({ src, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 852, // 고정 크기
    height: 230, // 고정 크기
    aspect: 852 / 230, // 비율
  });

  const [image, setImage] = useState(null);

  const onImageLoaded = (image) => {
    setImage(image);
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <button
          onClick={onClose}
          style={closeButtonStyles}
        >
          Close
        </button>
        <ReactCrop
          src={src}
          crop={crop}
          onChange={onCropChange}
          onComplete={onCropComplete}
          onImageLoaded={onImageLoaded}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default ImageCropper;
