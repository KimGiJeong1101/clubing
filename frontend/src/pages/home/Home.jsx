import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import './HomeImageCarousel.css';
import HomeCard from "../../components/commonEffect/HomeCard";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const images = [
  '/MainImage/mainImage.webp',
  '/MainImage/mainImage2.webp',
  '/MainImage/mainImage3.webp',
];

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

const fetchCardData = async () => {
  const response = await axios.get(`http://localhost:4000/clubs/card`);
  console.log('data:', response.data);
  return response.data;
};

const Home = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const { isLoading, error, data: clubsData } = useQuery({
    queryKey: ['clubData'],
    queryFn: fetchCardData,
    onSuccess: (data) => {
      console.log('데이터 가져오기 성공:', data);
    },
    onError: (err) => {
      console.error('데이터 가져오기 실패:', err);
    },
  });

  const nextImage = () => {
    setPage(([prevPage]) => [prevPage + 1, 1]);
  };

  const prevImage = () => {
    setPage(([prevPage]) => [prevPage - 1, -1]);
  };

  const imageIndex = (page) => (page % images.length + images.length) % images.length;

  useEffect(() => {
    const interval = setInterval(nextImage, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box className="carousel-container" sx={{ position: 'relative' }}>
        <Box className="carousel">
          <motion.div className="image-frame">
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

        <Button className="prev-btn" onClick={prevImage}>
          &#10094;
        </Button>
        <Button className="next-btn" onClick={nextImage}>
          &#10095;
        </Button>
      </Box>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error fetching data</div>}

      {/* clubsData 배열을 map으로 렌더링 */}
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {clubsData && clubsData.map((club, idx) => (
          <HomeCard key={idx} club={club} />
        ))}
      </Box>
    </>
  );
};

export default Home;
