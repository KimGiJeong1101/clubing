import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";

const MeetingList = () => {
  const [nowTime, setNowTime] = useState([]);

  const days = [
    "일", // Sunday
    "월", // Monday
    "화", // Tuesday
    "수", // Wednesday
    "목", // Thursday
    "금", // Friday
    "토", // Saturday
  ];
  // 번호를 받아 요일 이름을 반환하는 함수
  const getDayName = (dayNumber) => {
    return days[dayNumber];
  };

  useEffect(() => {
    const now = new Date();
    const dateList = [];
    for (let i = 0; i < 7; i++) {
      if (now.getDay() + i >= 7) {
        const date = {
          date: now.getDate() + i,
          day: getDayName(now.getDay() + i - 7),
        };
        dateList.push(date);
      } else {
        const date = {
          date: now.getDate() + i,
          day: getDayName(now.getDay() + i),
        };
        dateList.push(date);
      }
    }
    setNowTime(dateList);
    console.log(dateList);
  }, []);

  // const date = { date: "", day: "", hour: "", min: "" };
  // useEffect(() => {
  //   const now = new Date();
  //   date.date = now.getDate();
  //   date.day = getDayName(now.getDay());
  //   date.min = now.getMinutes();
  //   setNowTime(date);
  // });

  return (
    <Box sx={{ width: "100%", backgroundColor: "#F0EDED" }}>
      <Box
        sx={{
          width: "100%",
          height: "580px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ marginTop: "60px" }}>
          <Typography
            variant="h5"
            sx={{ margin: "10px", color: "red", fontWeight: "700" }}
          >
            <FaceRetouchingNaturalIcon
              sx={{ marginBottom: "5px", fontSize: "30px" }}
            />{" "}
            정기모임
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            margin: "5px",
            fontWeight: "900",
            fontFamily: "Pretendard",
            letterSpacing: "-.3rem",
          }}
        >
          똑같은 일상을 다채롭게
        </Typography>
        <Typography
          variant="h3"
          sx={{
            margin: "5px",
            fontWeight: "900",
            fontFamily: "Pretendard",
            letterSpacing: "-.3rem",
          }}
        >
          만들어 줄 정기 모임
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginTop: "30px",
            fontFamily: "Pretendard",
            letterSpacing: "-.1rem",
          }}
        >
          누구나 열고 참여할 수 있는 정기 모임,
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "150px",
            fontFamily: "Pretendard",
            letterSpacing: "-.1rem",
          }}
        >
          간단한 모임으로 가볍고 즐겁게 만나보세요!
        </Typography>
        {/* 게시글들 분류 텝 */}

        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "700",
              fontSize: "1.2rem",
              textAlign: "center",
              color: "black",
            },
          }}
        >
          {nowTime.map((a, i) => {
            return (
              <Tab
                label={
                  <Box sx={{ marginLeft: "40px", marginRight: "40px" }}>
                    <Box sx={{ fontWeight: "500" }}>{nowTime[i].day}</Box>
                    <Box>{nowTime[i].date}</Box>
                  </Box>
                }
              />
            );
          })}
        </Tabs>
        {/* 게시글들 분류 텝.end */}
      </Box>
      <Container maxWidth="lg">
        <Grid>
          <Grid
            item
            onClick={() => {}}
            xs={12}
            sm={12}
            md={6}
            sx={{ height: "200px", marginBottom: "30px" }}
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
                    width: "160px",
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
                    src="" // 이미지 경로
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
                  서브타이틀
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "700",
                    fontSize: "22px",
                    color: "#383535",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  제목
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    color: "#9F9E9D",
                    display: "inline-flex",
                  }}
                >
                  메인카테고리 · 지역 ·
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ color: "green", display: "inline-flex" }}
                >
                  {" "}
                  채팅
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center", // 수직 중앙 정렬
                    margin: "10px 0px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                    }}
                  >
                    <span style={{ marginLeft: "5px" }}>0명/20명</span>
                  </Box>
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MeetingList;
