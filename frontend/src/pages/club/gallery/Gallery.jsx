import { Box } from "@mui/material";
import React, { useEffect } from "react";
import axiosInstance from "../../../utils/axios";
import { useLocation } from "react-router-dom";

function Gallery() {
  //Clubmember=3 이란 거 가져오기 위해서!
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  useEffect(() => {
    console.log('useEffect 에서 엑시오스인스턴스 테스트 중 실행 ')
    axiosInstance
      .get(`/clubs/galleries/read?clubNumber=${clubNumber}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      Gallery
      <Box sx={{ height: "500px", backgroundColor: "black" }}>gdgd</Box>
    </div>
  );
}

export default Gallery;
