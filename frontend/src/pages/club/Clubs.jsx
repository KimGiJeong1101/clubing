import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BubbleAnimation from "../../components/club/BubbleAnimation.js";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import RowingIcon from "@mui/icons-material/Rowing";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
const Clubs = () => {
  const getClubList = async () => {
    const response = await fetch("http://localhost:4000/clubs");
    const data = await response.json();
    return data;
  };

  const {
    data: clubList,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clubList"],
    queryFn: getClubList,
  });
  const navigate = useNavigate();

  //무한스크롤 구현
  const getClubListScroll = async () => {
    const response = await fetch(`http://localhost:4000/clubs/scroll/${scrollCount}`);
    const data = await response.json();

    setScrollData((prevData) => [...prevData, ...data]); // 이전 데이터와 새 데이터를 병합
    if (data.length === 3) {
      window.addEventListener("scroll", handleScroll);
    } else if (data.length !== 3) {
    }
  };
  let [scrollCount, setScrollCount] = useState(1);
  let [scrollData, setScrollData] = useState([]);

  let handleScroll = () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight;
    let clientHeight = window.innerHeight;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setScrollCount(scrollCount++);
      getClubListScroll();
      window.removeEventListener("scroll", handleScroll);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // 클리어 하기위한 함수
    };
  }, []);
  //무한스크롤 구현.end

  //추천
  const handleCategoryClick = () => {
    // 카테고리별 버튼 클릭 시 동작
    console.log('카테고리별 클릭');
  };

  const handleRegionClick = () => {
    // 지역별 버튼 클릭 시 동작
    console.log('지역별 클릭');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "#F2F2F2", position: "relative" }}>
      <Fab
        onClick={() => {
          navigate("/clubs/create");
        }}
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
        }}
      >
        <AddIcon />
      </Fab>
      <Box
        sx={{
          position: "fixed",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleCategoryClick}>
          카테고리별
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRegionClick}>
          지역별
        </Button>
      </Box>
      <Box sx={{ width: "100%", height: "400px", backgroundColor: "white" }}>
        <Container maxWidth="lg" sx={{ marginTop: "40px", paddingBottom: "40px" }}>
          <Grid container spacing={3} justifyContent="center">
            {[
              // { color: "#68BDAB", icon: <StorefrontIcon sx={{ width: "70px", height: "70px" }} />, text: "전부보기" },
              { color: "#71ABF0", icon: <FastfoodIcon sx={{ width: "70px", height: "70px" }} />, text: "푸드·드링크" },
              { color: "#DC6A5A", icon: <MenuBookIcon sx={{ width: "70px", height: "70px" }} />, text: "자기계발" },
              { color: "#9363D1", icon: <NightlifeIcon sx={{ width: "70px", height: "70px" }} />, text: "취미" },
              { color: "#D7E56E", icon: <RowingIcon sx={{ width: "70px", height: "70px" }} />, text: "액티비티" },
              { color: "#EE7E8C", icon: <CelebrationIcon sx={{ width: "70px", height: "70px" }} />, text: "파티" },
              { color: "#4C5686", icon: <SportsKabaddiIcon sx={{ width: "70px", height: "70px" }} />, text: "소셜게임" },
              { color: "#F7D16E", icon: <ColorLensIcon sx={{ width: "70px", height: "70px" }} />, text: "문화·예술" },
              { color: "#C25BA1", icon: <LocalAtmIcon sx={{ width: "70px", height: "70px" }} />, text: "N잡·재테크" },
              { color: "#DEB650", icon: <LoyaltyIcon sx={{ width: "70px", height: "70px" }} />, text: "연애·사랑" },
              { color: "#78C17C", icon: <LocalAirportIcon sx={{ width: "70px", height: "70px" }} />, text: "여행·나들이" },
              { color: "#828ED6", icon: <Diversity1Icon sx={{ width: "70px", height: "70px" }} />, text: "동네·또래" },
              { color: "#8E44AD", icon: <AutoStoriesIcon sx={{ width: "70px", height: "70px" }} />, text: "외국어" },
            ].map((item, index) => (
              <Grid item xs={2} sm={2} lg={2} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      backgroundColor: item.color,
                      width: "100px",
                      height: "100px",
                      borderRadius: "50px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "8px",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: item.color + "BF", // Slightly darker color on hover
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ textAlign: "center", fontSize: "18px", fontWeight: "550" }}>{item.text}</Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ marginTop: "40px", paddingBottom: "40px" }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {clubList.map((club) => (
            <Grid item xs={12} sm={6} md={4} key={club._id} sx={{}}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: "white",
                  boxShadow: "none", // 그림자 제거
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "300px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src={`http://localhost:4000/` + club.img}
                    alt={club.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px 50px 0 0",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "#f2f2f2",
                      width: "150px",
                      height: "40px",
                      paddingBottom: "18px",
                      borderBottom: "15px solid #f2f2f2",
                      borderLeft: "15px solid #f2f2f2",
                      borderBottomLeftRadius: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: "5px",
                        marginLeft: "5px",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "130px",
                        height: "50px",
                        color: "#3f51b5",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        backgroundColor: "white",
                      }}
                    >
                      {club.mainCategory}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "200px",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "700",
                      fontSize: "20px",
                      color: "#383535",
                      marginBottom: "8px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {club.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "500",
                      fontSize: "18px",
                      color: "#777777",
                      marginBottom: "8px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {club.subTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9F9E9D",
                      marginBottom: "8px",
                    }}
                  >
                    {club.region.district}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CommentRoundedIcon sx={{ color: "#BF5B16", fontSize: "18px" }} />
                    <Typography variant="body2" sx={{ color: "#BF5B16", marginLeft: "5px" }}>
                      5분 전 대화
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "auto",
                      borderTop: "1px solid #e0e0e0",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    }}
                  >
                    <AvatarGroup max={4}>
                      {club.members.map((member, idx) => (
                        <Avatar key={idx} alt={`Member ${idx + 1}`} src={member.img} sx={{ width: 32, height: 32 }} />
                      ))}
                    </AvatarGroup>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "8px",
                        fontSize: "16px",
                        color: "#666666",
                      }}
                    >
                      <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                      <span style={{ marginLeft: "5px" }}>
                        {club.members.length}/{club.maxMember}
                      </span>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: 0,
                      backgroundColor: "#f2f2f2",
                      width: "65px",
                      height: "60px",
                      paddingTop: "10px",
                      borderBottom: "15px solid #f2f2f2",
                      borderLeft: "15px solid #f2f2f2",
                      borderTopLeftRadius: "20px",
                      zIndex: 999999999,
                    }}
                    onClick={() => navigate(`/clubs/main?clubNumber=${club._id}`)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: "5px",
                        marginRight: "5px",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50px",
                        height: "50px",
                        color: "#3f51b5",
                        fontWeight: "bold",
                        borderRadius: "25px",
                        backgroundColor: "black",
                        transition: "all 0.3s ease", // 모든 속성에 대해 부드럽게 변환
                        "&:hover": {
                          transform: "scale(1.2)", // 호버 시 크기 확대
                          color: "#f2f2f2", // 색상 변경
                          backgroundColor: "#3f51b5", // 배경색 변경
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // 그림자 추가
                          cursor: "pointer",
                        },
                      }}
                    >
                      <ArrowForwardIcon sx={{ color: "white" }} />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
          {scrollData &&
            scrollData.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club._id} sx={{}}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "white",
                    boxShadow: "none", // 그림자 제거
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <img
                      src={`http://localhost:4000/` + club.img}
                      alt={club.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px 50px 0 0",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "#f2f2f2",
                        width: "150px",
                        height: "40px",
                        paddingBottom: "18px",
                        borderBottom: "15px solid #f2f2f2",
                        borderLeft: "15px solid #f2f2f2",
                        borderBottomLeftRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "5px",
                          marginLeft: "5px",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "130px",
                          height: "50px",
                          color: "#3f51b5",
                          fontWeight: "bold",
                          borderRadius: "20px",
                          backgroundColor: "white",
                        }}
                      >
                        {club.mainCategory}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      height: "200px",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#383535",
                        marginBottom: "8px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {club.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "500",
                        fontSize: "18px",
                        color: "#777777",
                        marginBottom: "8px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {club.subTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9F9E9D",
                        marginBottom: "8px",
                      }}
                    >
                      {club.region.district}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CommentRoundedIcon sx={{ color: "#BF5B16", fontSize: "18px" }} />
                      <Typography variant="body2" sx={{ color: "#BF5B16", marginLeft: "5px" }}>
                        5분 전 대화
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "auto",
                        borderTop: "1px solid #e0e0e0",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      <AvatarGroup max={4}>
                        {club.members.map((member, idx) => (
                          <Avatar key={idx} alt={`Member ${idx + 1}`} src={member.img} sx={{ width: 32, height: 32 }} />
                        ))}
                      </AvatarGroup>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "8px",
                          fontSize: "16px",
                          color: "#666666",
                        }}
                      >
                        <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                        <span style={{ marginLeft: "5px" }}>
                          {club.members.length}/{club.maxMember}
                        </span>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: 0,
                        backgroundColor: "#f2f2f2",
                        width: "65px",
                        height: "60px",
                        paddingTop: "10px",
                        borderBottom: "15px solid #f2f2f2",
                        borderLeft: "15px solid #f2f2f2",
                        borderTopLeftRadius: "20px",
                        zIndex: 999999999,
                        transition: "transform 0.3s ease", // 호버 시 변화를 부드럽게
                      }}
                      onClick={() => navigate(`/clubs/main?clubNumber=${club._id}`)} // 클릭 핸들러 추가
                    >
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "5px",
                          marginRight: "5px",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "50px",
                          height: "50px",
                          color: "#3f51b5",
                          fontWeight: "bold",
                          borderRadius: "25px",
                          backgroundColor: "black",
                          transition: "transform 0.3s ease", // 호버 시 변화를 부드럽게
                          "&:hover": {
                            transform: "scale(1.2)", // 호버 시 크기 확대
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ArrowForwardIcon sx={{ color: "white" }} />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Container>
      <BubbleAnimation /> {/* BubbleAnimation을 상위 요소로 추가 */}
    </Box>
  );
};

export default Clubs;
