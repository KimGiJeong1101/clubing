import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion"; // Framer Motion을 사용해 애니메이션 구현
import Box from '@mui/material/Box'; // MUI의 Box 컴포넌트 사용
import Button from '@mui/material/Button'; // MUI의 Button 컴포넌트 사용
import './HomeImageCarousel.css'; // CSS 파일 임포트 (이미지 캐러셀의 스타일 정의)

// 이미지 배열, 캐러셀에서 순차적으로 보여줄 이미지들
const images = [
  '/MainImage/mainImage.webp',
  '/MainImage/mainImage2.webp',
  '/MainImage/mainImage3.webp',
];

// 이미지 애니메이션의 상태 정의
const imageVariants = {
  enter: (direction) => ({
    // 이미지가 처음 등장할 때 위치와 투명도 설정
    opacity: 0,
    x: direction > 0 ? window.innerWidth : -window.innerWidth, // 슬라이드 방향에 따른 x 축 이동
    transition: {
      type: "spring", // 스프링 애니메이션 적용
      stiffness: 300, // 스프링 강도
      damping: 20, // 스프링 감쇠력
    },
  }),
  center: {
    // 중앙에 있을 때 상태
    zIndex: 1, // 레이어 순서
    opacity: 1, // 불투명도 (완전하게 보이도록 설정)
    x: 0, // x 축 위치 중앙
    transition: {
      x: {
        type: "spring", // 스프링 애니메이션 적용
        stiffness: 300,
        damping: 20,
        restDelta: 2, // 약간의 흔들림 설정
        restSpeed: 2, // 스프링 안정화 후 속도 설정
      },
      opacity: { duration: 3 }, // 불투명도 변화 지속 시간
    },
  },
  exit: (direction) => ({
    // 이미지가 퇴장할 때 상태
    zIndex: 0, // 이미지가 뒤로 감
    opacity: 0, // 이미지가 투명해짐
    x: direction < 0 ? window.innerWidth : -window.innerWidth, // 슬라이드 방향에 따른 x 축 이동
    transition: {
      x: {
        type: "spring", // 스프링 애니메이션 적용
        stiffness: 300,
        damping: 30, // 감쇠력을 더 강하게 설정
      },
      opacity: { duration: 3 }, // 불투명도 변화 지속 시간
    },
  }),
};

const Home = () => {
  // 페이지와 방향을 저장하는 상태
  const [[page, direction], setPage] = useState([0, 0]);

  // 다음 이미지를 보여주는 함수
  const nextImage = useCallback(() => {
    setPage(([prevPage]) => [prevPage + 1, 1]); // 페이지 번호 증가 및 방향 설정 (1: 다음)
  }, []);

  // 이전 이미지를 보여주는 함수
  const prevImage = () => setPage(([prevPage]) => [prevPage - 1, -1]); // 페이지 번호 감소 및 방향 설정 (-1: 이전)

  // 현재 페이지의 이미지 인덱스를 계산
  const imageIndex = (page) => (page % images.length + images.length) % images.length;

  // 8초마다 자동으로 다음 이미지를 보여줌 (nextImage 함수 호출)
  useEffect(() => {
    const interval = setInterval(nextImage, 8000); // 8000ms (8초)마다 실행
    return () => clearInterval(interval); // 컴포넌트가 사라질 때 interval 해제
  }, [nextImage]);

  return (
    <>
      <Box className="carousel-container" sx={{ position: 'relative' }}>
        {/* 이미지 캐러셀 영역 */}
        <Box className="carousel">
          <motion.div className="image-frame">
            {/* 이미지 슬라이드 애니메이션 */}
            <motion.img
              key={page} // 각 페이지를 구분할 수 있도록 key 값 설정
              src={images[imageIndex(page)]} // 현재 페이지에 해당하는 이미지
              custom={direction} // 슬라이드 방향 전달
              variants={imageVariants} // 슬라이드 애니메이션 적용
              initial="enter" // 처음 진입 애니메이션 상태
              animate="center" // 중간 상태
              exit="exit" // 퇴장 상태
              className="carousel-image" // 이미지 스타일을 위한 클래스
            />
          </motion.div>
        </Box>

        {/* 이전 이미지로 가는 버튼 */}
        <Button className="prev-btn" onClick={prevImage}>
          &#10094; {/* 좌측 화살표 */}
        </Button>
        {/* 다음 이미지로 가는 버튼 */}
        <Button className="next-btn" onClick={nextImage}>
          &#10095; {/* 우측 화살표 */}
        </Button>
      </Box>
    </>
  );
};

export default Home;
