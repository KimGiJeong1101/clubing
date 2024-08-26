import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import club from "../../data/Club.js";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from './../../utils/axios';

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

  const [value, setValue] = useState(0);
  const [list, setList] = useState(club);

  const handleChange = (event, newValue) => {
    let copy = [];
    for (let i = 0; i < club.length; i++) {
      if (club[i].detailTag === value) {
        copy.push(club[i]);
        setList(copy);
      }
    }
    setValue(newValue);
  };

  const navigate = useNavigate();
  ///////////////////////////////////
  // let isLoading2 = false; // 플래그 변수로 로딩 상태를 추적

  // const handleScroll = async () => {
  //   if (
  //     window.innerHeight + window.scrollY >=
  //     document.documentElement.scrollHeight - 50
  //   ) {
  //     if (!isLoading2) {
  //       isLoading2 = true; // 요청이 진행 중임을 표시
  //       window.removeEventListener("scroll", handleScroll);

  //       try {
  //         console.log("스크롤이 맨밑에 닿았어요!");

  //         // axios 요청을 여기서 처리
  //         const response = await axiosInstance.get("/clubs/scroll");
          
  //         // 응답 데이터 처리
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error("데이터 요청 중 오류 발생:", error);
  //       } finally {
  //         window.addEventListener('scroll', handleScroll);
  //         isLoading2 = false; // 요청 완료 후 플래그 리셋
  //       }
  //     }
  //   }
  // };

  // // 스크롤 이벤트 리스너 추가
  // window.addEventListener("scroll", handleScroll);
///////////////////////////////////
  // 스크롤 이벤트 리스너 제거 (필요에 따라 사용)
  // window.removeEventListener('scroll', handleScroll);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "#F0EDED" }}>
      {/* 글작성 버튼 */}
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
      <Container
        maxWidth="lg"
        sx={{ marginTop: "40px", paddingBottom: "40px" }}
      >
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
                  {/* 메인 카테고리 */}
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
                    <Typography
                      variant="caption"
                      sx={{ color: "#3f51b5", fontWeight: "bold" }}
                    >
                      {club.mainCategory}
                    </Typography>
                  </Box>
                  {/* 메인 카테고리.end */}
                </Box>
                {/* 클럽 */}
                <Box
                  sx={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "230px",
                  }}
                >
                  {/* 클럽 제목 */}
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
                  {/* 클럽 제목.end */}
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
                    <CommentRoundedIcon
                      sx={{ color: "#BF5B16", fontSize: "18px" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#BF5B16", marginLeft: "5px" }}
                    >
                      {list[index].chat}
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
                        <Avatar
                          key={idx}
                          alt={`Member ${idx + 1}`}
                          src={member.img}
                          sx={{ width: 32, height: 32 }}
                        />
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
    </Box>
  );
};

export default Clubs;
