import React, { useEffect, useState } from "react";
import { Avatar, AvatarGroup, Box, Container, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import clubCategories from "../main/CategoriesDataClub";
import { useQuery } from "@tanstack/react-query";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { useNavigate } from "react-router-dom";

const MeetingList = () => {
  const [nowTime, setNowTime] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 선택된 탭의 상태
  const [category, setCategory] = useState(["맞춤 추천", ...Object.keys(clubCategories)]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(0); // 선택된 탭의 상태
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const [nowDate, setNowDate] = useState("");
  const navigate = useNavigate();

  // 날짜 목록 생성
  useEffect(() => {
    const now = new Date();
    const dateList = [];
    for (let i = 0; i < 14; i++) {
      const tempDate = new Date(now);
      tempDate.setDate(now.getDate() + i);
      const date = {
        date: tempDate.getDate(),
        day: days[tempDate.getDay()],
        fullDate: tempDate.toISOString().split("T")[0], // "YYYY-MM-DD" 형식으로 날짜 저장
      };
      dateList.push(date);
    }
    setNowTime(dateList);
    setNowDate(dateList[0].fullDate);
    console.log(`dateList[0]`);
  }, []);

  // 탭 클릭 핸들러
  const handleTabClick = (date) => {
    setNowDate(date);
  };

  // 미팅 리스트 가져오기
  const getMeetingList = async () => {
    const response = await fetch(`http://localhost:4000/meetings?nowDate=${nowDate}`);
    const data = await response.json();
    console.log(data);
    return data;
  };

  const {
    data: meetingList,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meetingList", nowDate],
    queryFn: getMeetingList,
    enabled: !!nowDate,
  });

  // // 번호를 받아 요일 이름을 반환하는 함수
  // const getDayName = (dayNumber) => {
  //   return days[dayNumber % 7]; // 월-일 기준으로 요일 반환
  // };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); // 클릭된 탭을 설정
  };

  const handleCategoryTabChange = (event, newValue) => {
    setSelectedCategoryTab(newValue); // 클릭된 탭을 설정
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "white" }}>
      <Container
        sx={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        {/* 게시글들 분류 텝 */}
        <Grid item xs={12}>
          <Box sx={{ fontSize: "25px", fontWeight: "600" }}>다가오는 정기모임</Box>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={selectedTab} // 선택된 탭 상태를 지정
            onChange={handleTabChange} // 탭 변경 이벤트 핸들러
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            TabIndicatorProps={{ style: { display: "none" } }} // 밑줄 없애기
            sx={{
              "& .MuiTab-root": {
                fontWeight: "700",
                fontSize: "1.2rem",
                textAlign: "center",
                color: "#A6836F",
                minWidth: "60px", // 탭의 최소 너비를 설정하여 크기를 줄임
                margin: "12px 25px", // 탭의 안쪽 여백을 조정하여 크기를 줄임
              },
              "& .Mui-selected": {
                backgroundColor: "#A6836F", // 선택된 탭 배경색 검정
                borderRadius: "50%", // 원 모양으로 만들기
                color: "white !important", // 선택된 탭 글씨 색상 하얀색
              },
            }}
          >
            {nowTime.map((item, i) => (
              <Tab
                onClick={() => handleTabClick(item.fullDate)} // 클릭 시 상태 업데이트
                key={i}
                label={
                  <Box sx={{ marginLeft: "15px", marginRight: "15px" }}>
                    <Box sx={{ fontWeight: "500" }}>{nowTime[i].day}</Box>
                    <Box>{nowTime[i].date}</Box>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Grid>
      </Container>
      {/* 게시글들 분류 텝.end */}
      {/* 모임리스트들 */}
      <Container maxWidth="lg" sx={{ backgroundColor: "#f2f2f2", padding: "20px", borderRadius: "30px" }}>
        {meetingList &&
          meetingList.map((meeting, index) => {
            const avatars = meeting.joinMember.map((member, i) => (
              <Avatar
                key={i}
                alt={member.name}
                src={member.avatarUrl || "/static/images/avatar/default.jpg"} // 기본 이미지 URL 설정
              />
            ));
            return (
              <Grid container spacing={1} key={index}>
                <Grid
                  item
                  xs={6}
                  onClick={() => {
                    navigate(`/clubs/main?clubNumber=${meeting.clubNumber}`);
                  }}
                  sx={{
                    height: "200px",
                    marginBottom: "30px",
                    cursor: "pointer", // 커서 포인터 추가
                    transition: "all 0.3s ease", // 부드러운 전환 효과 추가
                    "&:hover": {
                      // 호버 스타일 추가
                      backgroundColor: "#f0f0f0", // 호버 시 배경색 변경
                      transform: "scale(1.05)", // 호버 시 살짝 확대
                    },
                  }}
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
                          src={`http://localhost:4000/` + meeting.img} // 이미지 경로
                          alt="Example222"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover", // 박스 크기에 맞게 이미지 잘리기
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "700",
                          fontSize: "22px",
                          color: "#383535",
                        }}
                      >
                        {meeting.title}
                      </Typography>
                      <Box sx={{ margin: "4px" }}>일시 : {meeting.dateTime}</Box>
                      <Box sx={{ margin: "4px" }}>위치 : {meeting.where}</Box>
                      <Box sx={{ margin: "4px" }}>비용 : {meeting.cost}</Box>

                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center", // 수직 중앙 정렬
                          margin: "10px 0px",
                        }}
                      >
                        <AvatarGroup max={4}>{avatars}</AvatarGroup>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "8px",
                          }}
                        >
                          <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                          <span style={{ marginLeft: "5px" }}>
                            {meeting?.joinMember?.length}/{meeting?.totalCount}
                          </span>
                        </Box>
                      </Box>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            );
          })}
        <Typography
          variant={"h6"}
          sx={{
            color: "#A6836F",
            background: "white",
            textAlign: "center",
            borderRadius: "30px",
            width: "100%",
            height: "50px",
            display: "flex", // 플렉스 박스 사용
            alignItems: "center", // 수직 중앙 정렬
            justifyContent: "center", // 수평 중앙 정렬
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 기본 그림자
            transition: "all 0.3s ease", // 애니메이션 효과
            "&:hover": {
              backgroundColor: "#A6836F", // 호버 시 배경색 변경
              color: "white", // 호버 시 글자색 변경
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // 호버 시 그림자 강화
              cursor: "pointer",
            },
          }}
        >
          더보기
        </Typography>
      </Container>
      {/* 모임리스트 끝 */}
      <Container
        sx={{
          width: "100%",
          height: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
          marginTop: "30px",
        }}
      >
        {/* 카테고리별 모임 */}
        <Grid item xs={12}>
          <Box sx={{ fontSize: "25px", fontWeight: "600" }}>카테고리 별 정기모임</Box>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={selectedCategoryTab} // 선택된 탭 상태를 지정
            onChange={handleCategoryTabChange} // 탭 변경 이벤트 핸들러
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            TabIndicatorProps={{ style: { display: "none" } }} // 밑줄 없애기
            sx={{
              "& .MuiTab-root": {
                fontWeight: "700",
                fontSize: "1.2rem",
                textAlign: "center",
                color: "#A6836F",
                minWidth: "60px", // 탭의 최소 너비를 설정하여 크기를 줄임
                margin: "12px 25px", // 탭의 안쪽 여백을 조정하여 크기를 줄임
              },
              "& .Mui-selected": {
                border: "1px solid #A6836F", // 선택된 탭 배경색 검정
                borderRadius: "20px",
                color: "#A6836F !important", // 선택된 탭 글씨 색상 하얀색
              },
            }}
          >
            {category.map((a, i) => (
              <Tab
                key={i}
                label={
                  <Box sx={{ marginLeft: "5px", marginRight: "5px" }}>
                    <Box sx={{ fontWeight: "500" }}>{a}</Box>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Grid>
        {/* 카테고리별 모임.end */}
      </Container>
      {/* 모임리스트들 */}
      <Container maxWidth="lg" sx={{ backgroundColor: "#f2f2f2", padding: "20px", borderRadius: "30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={6} sx={{ height: "200px", marginBottom: "30px" }}>
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
                    overflow: "hidden",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src="" // 이미지 경로
                    alt="Example"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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

                <Typography variant="h6" sx={{ color: "green", display: "inline-flex" }}>
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
          <Grid item xs={6} sx={{ height: "200px", marginBottom: "30px" }}>
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
                    overflow: "hidden",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src="" // 이미지 경로
                    alt="Example"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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

                <Typography variant="h6" sx={{ color: "green", display: "inline-flex" }}>
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
          <Grid item xs={6} sx={{ height: "200px", marginBottom: "30px" }}>
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
                    overflow: "hidden",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src="" // 이미지 경로
                    alt="Example"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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

                <Typography variant="h6" sx={{ color: "green", display: "inline-flex" }}>
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
          <Grid item xs={6} sx={{ height: "200px", marginBottom: "30px" }}>
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
                    overflow: "hidden",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src="" // 이미지 경로
                    alt="Example"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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

                <Typography variant="h6" sx={{ color: "green", display: "inline-flex" }}>
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
        <Typography
          variant={"h6"}
          sx={{
            color: "#A6836F",
            background: "white",
            textAlign: "center",
            borderRadius: "30px",
            width: "100%",
            height: "50px",
            display: "flex", // 플렉스 박스 사용
            alignItems: "center", // 수직 중앙 정렬
            justifyContent: "center", // 수평 중앙 정렬
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 기본 그림자
            transition: "all 0.3s ease", // 애니메이션 효과
            "&:hover": {
              backgroundColor: "#A6836F", // 호버 시 배경색 변경
              color: "white", // 호버 시 글자색 변경
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // 호버 시 그림자 강화
              cursor: "pointer",
            },
          }}
        >
          더보기
        </Typography>
      </Container>
      {/* 모임리스트 끝 */}
    </Box>
  );
};

export default MeetingList;
