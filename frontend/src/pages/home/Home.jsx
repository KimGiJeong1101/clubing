import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomeImageCarousel.css'; // CSS 파일 임포트

const Home = () => {
  return (
    <div className="carousel-container">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        dynamicHeight={false} /* 고정 높이를 사용할 것이므로 false */
      >
        <div>
          <img src="/MainImage/mainImage.webp" alt="Main visual" />
        </div>
        <div>
          <img src="/MainImage/mainImage2.webp" alt="Second visual" />
        </div>
        <div>
          <img src="/MainImage/mainImage3.webp" alt="Third visual" />
        </div>
      </Carousel>
    </div>
  );
};

export default Home;
