import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import club from "../../../data/Club.js";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import PeopleIcon from "@mui/icons-material/People";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Main = () => {
  //스크롤 위로

  //미팅 지우기
  const deleteMeeting = async (meetingNumber) => {
    const response = await fetch(
      `http://localhost:4000/meetings/delete/` + meetingNumber
    );
    if (response.data) {
      alert("삭제 성공~");
      window.location.reload();
    } else {
      alert("삭제 실패함");
      window.location.reload();
    }
  };
  //미팅 지우기.end

  //Clubmember=3 이란 거 가져오기 위해서!
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get('clubNumber');

  //이미지를 위해서
  const [club2] = useState(club);
  const navigate = useNavigate();

  const getReadClub = async () => {
    const response = await fetch(`http://localhost:4000/clubs/read2/${clubNumber}`);
    const data = await response.json();
    console.log(data);
    return data;
  };
  const {
    data: readClub,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["readClub"],
    queryFn: getReadClub,
  });

  //////
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    navigate(`/clubs/update/${clubNumber}`);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      console.log("모임 삭제전");
      await axios.delete(`http://localhost:4000/clubs/delete/${clubNumber}`);
      console.log("모임 삭제");
      // 삭제 후 원하는 페이지로 이동
      navigate("/clubs");
    } catch (error) {
      console.error("삭제 실패:", error);
    }
    handleClose();
  };
  //////
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{backgroundColor: "#F4F4F4"}}>
      <Container maxWidth="md" sx={{ padding:'0px !important', }}>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "10px",
              width: "100%",
              height: "230px",
              overflow: "hidden", // 박스 영역을 넘어서는 이미지 잘리기
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0", // 박스 배경 색상 (선택 사항)
            }}
          >
            <img
              src="http://images.munto.kr/production-club/1722584963093-photo-wmt23-875855-0?s=640x640" // 이미지 경로
              alt="Example"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // 박스 크기에 맞게 이미지 잘리기
              }}
            />
          </Box>
        </Grid>
      </Container>
      <Container
        maxWidth="md"
        sx={{ backgroundColor: "white" }}
      >
          <Fab
            onClick={handleClick}
            color="primary"
            aria-label="add"
            style={{
              position: "fixed",
              bottom: "200px",
              right: "100px",
            }}
          >
            <AddIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpdate}>모임 및 게시글 수정</MenuItem>
            <MenuItem onClick={handleDelete}>모임 삭제</MenuItem>
          </Menu>
          {/* 모달창 버튼.end */}
          <Grid item xs={12} sx={{paddingLeft:'20px',paddingRight:'20px'}}>
          <Grid container >
            <Grid item xs={1}>
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "pink",
                  borderRadius: "30px",
                }}
              ></Box>
            </Grid>
            <Grid item xs={11}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    margin: "5px",
                    fontWeight: "900",
                    letterSpacing: "-.1rem",
                  }}
                >
                  {readClub.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                호스트 <b> 묭이</b>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: "#555555" }}>
              <b> 1</b>/{readClub.maxMember}명<b> {readClub.meeting.length}</b>{" "}
              정기모임
              <b> 0</b> 글 갯수
              <b> 5</b> 분 전 대화
            </Grid>
          </Grid>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: "30px" }}>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {readClub.content}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#1c8a6a",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginTop: "20px",
            }}
          >
            정기 모임
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#242424",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginBottom: "20px",
            }}
          >
            정기적으로 모임을 가지고 있어요
          </Typography>
          {/* 정기 모임 */}
          {readClub.meeting.length === 0 && <Box>아직 정기모임이 없습니다.</Box>}
          {readClub.meeting.map((a, i) => {
            return (
              <Grid container spacing={1} key={i}>
                <Grid
                  item
                  xs={12}
                  sx={{ height: "250px", marginBottom: "30px" }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      padding: "16px",
                      display: "flex",
                      borderRadius: "20px",
                    }}
                  >
                    <Grid item xs={12} sm={12} md={4}>
                      <Box
                        sx={{
                          width: "250px",
                          height: "200px",
                          overflow: "hidden", // 박스 영역을 넘어서는 이미지 잘리기
                          borderRadius: "20px", // 원하는 경우 둥근 모서리 적용
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f0f0f0", // 박스 배경 색상 (선택 사항)
                        }}
                      >
                        <img
                          src={club2[i].src} // 이미지 경로
                          alt="Example"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover", // 박스 크기에 맞게 이미지 잘리기
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                      <Grid
                      item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          variant="contained"
                          sx={{ borderRadius: "20px" }}
                        >
                          참석하기
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            deleteMeeting(readClub.meeting[i]._id);
                          }}
                          sx={{ borderRadius: "20px" }}
                        >
                          삭제하기
                        </Button>
                      </Grid>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "700",
                          fontSize: "22px",
                          color: "#383535",
                        }}
                      >
                        제목 {readClub.meeting[i].title}
                      </Typography>
                      <Box>일시 {readClub.meeting[i].dateTime}</Box>
                      <Box>위치 {readClub.meeting[i].where}</Box>
                      <Box>비용 {readClub.meeting[i].cost}</Box>

                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center", // 수직 중앙 정렬
                          margin: "10px 0px",
                        }}
                      >
                        <AvatarGroup max={4}>
                          <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                          />
                          <Avatar
                            alt="Travis Howard"
                            src="/static/images/avatar/2.jpg"
                          />
                          <Avatar
                            alt="Cindy Baker"
                            src="/static/images/avatar/3.jpg"
                          />
                          <Avatar
                            alt="Agnes Walker"
                            src="/static/images/avatar/4.jpg"
                          />
                          <Avatar
                            alt="Trevor Henderson"
                            src="/static/images/avatar/5.jpg"
                          />
                        </AvatarGroup>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "8px",
                          }}
                        >
                          <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                          <span style={{ marginLeft: "5px" }}>
                            {" "}
                            {readClub.meeting[i].joinCount}/
                            {readClub.meeting[i].totalCount}
                          </span>
                        </Box>
                      </Box>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            );
          })}

          {/* 비슷한 클럽.end */}

          <Typography
            sx={{
              fontSize: "14px",
              color: "#1c8a6a",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginTop: "20px",
            }}
          >
            가입 멤버
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#242424",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginBottom: "20px",
            }}
          >
            함께 소통하며 활동하고 있어요
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "pink",
                  borderRadius: "30px",
                }}
              ></Box>
            </Grid>
            <Grid item xs={11}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    margin: "5px",
                    fontWeight: "600",
                    letterSpacing: "-.1rem",
                  }}
                >
                  묭이
                </Typography>
              </Grid>
              <Grid item xs={12}>
                새로운 목표를 같이 달성해보고 싶어요. 서로의 고민이나 생각을
                나누며 함께 성장해보고 싶어요
              </Grid>
            </Grid>
          </Grid>
          <hr></hr>
          <Grid
            item
            xs={12}
            sx={{ backgroundColor: "#feebea", height: "200px",borderRadius:'20px' }}
          >
          </Grid>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#1c8a6a",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginTop: "20px",
            }}
          >
            안내 사항
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#242424",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginBottom: "20px",
            }}
          >
            자세한 정보를 알려드릴게요
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PeopleIcon /> {readClub.maxMember}명
            </Grid>
            <Grid item xs={12}>
              <WhereToVoteIcon /> {readClub.region.neighborhood}
            </Grid>
          </Grid>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#1c8a6a",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginTop: "20px",
            }}
          >
            비슷한 클럽
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#242424",
              fontFamily: "Pretendard",
              letterSpacing: "-.1rem",
              marginBottom: "20px",
            }}
          >
            이런 클럽은 어때요
          </Typography>
          {/* 비슷한 클럽 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ height: "200px", marginBottom: "30px" }}>
              <Paper
                elevation={2}
                sx={{ padding: "16px", display: "flex", borderRadius: "20px" }}
              >
                <Grid item xs={12} sm={12} md={4}>
                  <Box
                    sx={{
                      width: "250px",
                      height: "160px",
                      overflow: "hidden", // 박스 영역을 넘어서는 이미지 잘리기
                      borderRadius: "20px", // 원하는 경우 둥근 모서리 적용
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0f0f0", // 박스 배경 색상 (선택 사항)
                    }}
                  >
                    <img
                      src={club2[0].src} // 이미지 경로
                      alt="Example"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // 박스 크기에 맞게 이미지 잘리기
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                  <Box
                    sx={{
                      color: "#666060",
                      backgroundColor: "#F4F4F4",
                      display: "inline-flex",
                      borderRadius: "20px",
                      padding: "5px 20px",
                      margin: "10px 0px",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {club2[0].subTitle}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "700",
                      fontSize: "22px",
                      color: "#383535",
                    }}
                  >
                    {club2[0].title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "left",
                      color: "#9F9E9D",
                      display: "inline-flex",
                    }}
                  >
                    {club2[0].tag} · {club2[0].where} ·
                  </Typography>
                  <CommentRoundedIcon
                    sx={{ color: "green", fontSize: "18px" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "green", display: "inline-flex" }}
                  >
                    {" "}
                    {club2[0].chat}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center", // 수직 중앙 정렬
                      margin: "10px 0px",
                    }}
                  >
                    <AvatarGroup max={4}>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                      <Avatar
                        alt="Travis Howard"
                        src="/static/images/avatar/2.jpg"
                      />
                      <Avatar
                        alt="Cindy Baker"
                        src="/static/images/avatar/3.jpg"
                      />
                      <Avatar
                        alt="Agnes Walker"
                        src="/static/images/avatar/4.jpg"
                      />
                      <Avatar
                        alt="Trevor Henderson"
                        src="/static/images/avatar/5.jpg"
                      />
                    </AvatarGroup>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "8px",
                      }}
                    >
                      <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                      <span style={{ marginLeft: "5px" }}>
                        {club2[0].member.length}/{club2[0].maxMember}
                      </span>
                    </Box>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          {/* 비슷한 클럽.end */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Main;
