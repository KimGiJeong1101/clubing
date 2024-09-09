import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import { motion } from "framer-motion"; // Framer Motion을 사용해 애니메이션 구현
import './HomeImageCarousel.css'; // CSS 파일 임포트 (이미지 캐러셀의 스타일 정의)
import { throttle } from "lodash";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ClubListCard from "../../components/club/ClubListCard"; // ClubListCard 임포트

// 이미지 배열, 캐러셀에서 순차적으로 보여줄 이미지들
const images = [
  '/MainImage/mainImage.webp',
  '/MainImage/mainImage2.webp',
  '/MainImage/mainImage3.webp',
];

// 이미지 애니메이션의 상태 정의
const imageVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? window.innerWidth : -window.innerWidth,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
  center: {
    zIndex: 1,
    opacity: 1,
    x: 0,
    transition: {
      x: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        restDelta: 2,
        restSpeed: 2,
      },
      opacity: { duration: 3 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    opacity: 0,
    x: direction < 0 ? window.innerWidth : -window.innerWidth,
    transition: {
      x: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
      opacity: { duration: 3 },
    },
  }),
};

// 클럽 목록을 가져오는 API 함수
const fetchClubList = async () => {
  const response = await fetch(`http://localhost:4000/clubs`);
  const data = await response.json();
  return data;
};

const Home = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [scrollCount, setScrollCount] = useState(1);
  const [scrollData, setScrollData] = useState([]);

  const navigate = useNavigate();

  // 다음 이미지를 보여주는 함수
  const nextImage = useCallback(() => {
    setPage(([prevPage]) => [prevPage + 1, 1]);
  }, []);

  // 이전 이미지를 보여주는 함수
  const prevImage = () => setPage(([prevPage]) => [prevPage - 1, -1]);

  // 현재 페이지의 이미지 인덱스를 계산
  const imageIndex = (page) => (page % images.length + images.length) % images.length;

  // 8초마다 자동으로 다음 이미지를 보여줌 (nextImage 함수 호출)
  useEffect(() => {
    const interval = setInterval(nextImage, 8000); // 8000ms (8초)마다 실행
    return () => clearInterval(interval); // 컴포넌트가 사라질 때 interval 해제
  }, [nextImage]);

  // 클럽 목록 API 호출
  const { data: clubList, isLoading, error } = useQuery({
    queryKey: ['clubList'],
    queryFn: fetchClubList,
    keepPreviousData: true,
  });

  const handleScroll = useCallback(
    throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setScrollCount((prevCount) => {
          const newCount = prevCount + 1;
          fetchClubListScroll(newCount);
          return newCount;
        });
        window.removeEventListener("scroll", handleScroll);
      }
    }, 500),
    [scrollCount]
  );

  const fetchClubListScroll = async (newScrollCount) => {
    const response = await fetch(`http://localhost:4000/clubs/scroll/${newScrollCount}`);
    const data = await response.json();
    setScrollData((prevData) => [...prevData, ...data]);

    if (data.length < 6) {
      window.removeEventListener("scroll", handleScroll);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading club list</div>;
  }

  return (
    <>
      <Box className="carousel-container" sx={{ position: 'relative' }}>
        {/* 이미지 캐러셀 영역 */}
        <Box className="carousel">
          <motion.div className="image-frame">
            {/* 이미지 슬라이드 애니메이션 */}
            <motion.img
              key={page}
              src={images[imageIndex(page)]}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="carousel-image"
            />
          </motion.div>
        </Box>

        {/* 이전 이미지로 가는 버튼 */}
        <Button className="prev-btn" onClick={prevImage}>
          &#10094;
        </Button>
        {/* 다음 이미지로 가는 버튼 */}
        <Button className="next-btn" onClick={nextImage}>
          &#10095;
        </Button>
      </Box>

      {/* 클럽 리스트 출력 */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ClubListCard clubList={clubList} />
      </Container>
    </>
  );
};

export default Home;
