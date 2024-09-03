import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BubbleAnimation from "../../components/club/BubbleAnimation.js";

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
      alert("마지막 데이터임");
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
      <Box sx={{ width: "100%", height: "400px", backgroundColor: "white" }}></Box>
      <Container maxWidth="lg" sx={{ marginTop: "40px", paddingBottom: "40px" }}>
        <Grid container spacing={3}>
          {clubList.map((club, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={club._id}
              sx={{
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease",
                  backgroundColor: "white",
                }}
                onClick={() => navigate(`/clubs/main?clubNumber=${club._id}`)}
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
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      backgroundColor: "#ffffff",
                      padding: "8px",
                      borderRadius: "12px",
                      opacity: "0.8",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                      {club.mainCategory}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "230px",
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
                        fontSize: "14px",
                        color: "#666666",
                      }}
                    >
                      <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                      <span style={{ marginLeft: "5px" }}>
                        {club.members.length}/{club.maxMember}
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
          {scrollData &&
            scrollData.map((club, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={club._id}
                sx={{
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s ease",
                    backgroundColor: "white",
                  }}
                  onClick={() => navigate(`/clubs/main?clubNumber=${club._id}`)}
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
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        backgroundColor: "#ffffff",
                        padding: "8px",
                        borderRadius: "12px",
                        opacity: "0.8",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                        {club.mainCategory}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      height: "230px",
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
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                        <span style={{ marginLeft: "5px" }}>
                          {club.members.length}/{club.maxMember}
                        </span>
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
