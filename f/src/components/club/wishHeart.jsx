import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // 추가
import axiosInstance from "./../../utils/axios";

const WishHeart = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate(); // 추가

    // Redux store에서 상태를 가져옵니다.
    const user = useSelector((state) => state.user.userData.user);
    const getClub = useSelector((state) => state.getClub);
    const Heart = getClub.clubs.wishHeart;
    const email = user.email;
    const clubNumber = getClub._id;
  
    useEffect(() => {
      if (getClub.clubs && Array.isArray(Heart) && email) {
        setIsFavorite(Heart.includes(email));
      }
    }, [getClub, user.userData.user.email, clubNumber]);
  
    const handleFavoriteToggle = () => {
      if (email === "") {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }
  
      const url = isFavorite
        ? `/clubs/removeWish/${clubNumber}`
        : `/clubs/addWish/${clubNumber}`;
  
      axiosInstance
        .post(url)
        .then(() => {
          setIsFavorite(!isFavorite); // 상태 업데이트
        })
        .catch((err) => {
          console.log(err);
          alert("찜하기에 실패했습니다.");
        });
    };
  
  // FavoriteComponent를 내부에 정의
    const FavoriteComponent = ({ isFavorite, onToggle }) => (
        <div onClick={onToggle} style={{ cursor: 'pointer', color: isFavorite ? 'lightcoral' : 'gray' }}>
            ♥️
        </div>
    );

    return (
      <FavoriteComponent 
        isFavorite={isFavorite} 
        onToggle={handleFavoriteToggle} 
      />
    );
  };

  export default WishHeart;