import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Container, Tooltip, IconButton, Avatar, AvatarGroup,Paper, Tab, Tabs, } from "@mui/material";
import { motion } from "framer-motion";
import './HomeImageCarousel.css';
import HomeCard from "../../components/commonEffect/HomeCard";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axiosInstance from "../../utils/axios";
import clubCategories from "../../pages/club/main/CategoriesDataClub";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

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

// API 부분
const fetchCardData = async () => {
  const response = await axios.get(`http://localhost:4000/clubs/home/card`);
  return response.data;
};

const fetchNewClubsData = async () => {
  const response = await axios.get(`http://localhost:4000/clubs/home/card/new`);
  return response.data;
};

// 추천 모임 데이터 가져오기
const fetchRecommendedClubs = async (email) => {
  const response = await axios.get('http://localhost:4000/clubs/home/recommend', {
    params: { email } // 여기서 email은 문자열입니다.
  });
  return response.data;
};

  // 이벤트 목록을 가져오는 함수
  const fetchEvents = async () => {
    const response = await axios.get('http://localhost:4000/clubs/home/event');
    console.log(response.data); // 데이터 출력
    return response.data;
};

const Home = () => {
  const navigate = useNavigate();

  const [[page, direction], setPage] = useState([0, 0]);

  const email = useSelector(state => state.user?.userData?.user?.email || null);
  // console.log(email)

  // 기존 클럽 데이터
  const { isLoading: loadingClubs, error: clubsError, data: clubsData } = useQuery({
    queryKey: ['clubData'],
    queryFn: fetchCardData,
  });

  // 신규 모임 데이터
  const { isLoading: loadingNewClubs, error: newClubsError, data: newClubsData } = useQuery({
    queryKey: ['newClubData'],
    queryFn: fetchNewClubsData,
  });

  // 추천 모임 데이터
  const { isLoading: loadingRecommendedClubs, error: recommendedClubsError, data: recommendedClubsData } = useQuery({
    queryKey: ['recommendedClubs', email], // 이메일을 쿼리 키에 포함
    queryFn: () => fetchRecommendedClubs(email), // 이메일을 직접 전달
    enabled: true // 항상 쿼리를 실행
  });

  //정기모임 데이터
  const [nowDate, setNowDate] = useState("");

  // 미팅 리스트 가져오기
  const getMeetingList = async () => {
    const response = await fetch(`http://localhost:4000/meetings?nowDate=${nowDate}`);
    const data = await response.json();
    return data;
  };

  const {data: meetingList, isLoading: meetingClubs, error: meetingClubsError} = useQuery({
    queryKey: ["meetingList", nowDate],
    queryFn: getMeetingList,
    enabled: !!nowDate,
    keepPreviousData: true, // 이전 데이터를 유지
  });

  //이벤트 캐러셀 가져오기
    const {data: events = [],isLoading: event, error: eventError} = useQuery({
      queryKey: ['events'],
      queryFn: fetchEvents,
  });

  

  const isLoading = loadingClubs || loadingNewClubs || loadingRecommendedClubs||meetingClubs||event;
  const error = clubsError || newClubsError || recommendedClubsError||meetingClubsError||eventError;

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

  // 중심을 기준으로 카드들이 회전하도록 하는 로직
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation(prev => prev + 20); // 매번 20도씩 회전
    }, 3000);

    return () => clearInterval(rotateInterval);
  }, []);

  const tooltipText = email
    ? `선택한 지역 및 관심사 기준으로 추천해드립니다.  
       지역 및 관심사 변경은
       마이페이지-회원정보-정보수정 에서 가능합니다.`
    : `선택한 지역 및 관심사 기준으로 추천해드립니다. 로그인 시 정확한 추천 정보를 받을 수 있습니다.`;

  // 정기모임
  const [nowTime, setNowTime] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 선택된 탭의 상태
  const [category, setCategory] = useState([...Object.keys(clubCategories)]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(0); // 선택된 탭의 상태
 
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const [moreMeetingList, setMoreMeetingList] = useState([]);
  const [moreMeetingListCount, setMoreMeetingListCount] = useState(0);


// 탭 클릭 핸들러
const moreMeetingListHandler = () => {
  setMoreMeetingListCount((prev) => prev + 1); // 상태 업데이트 반환
};
//더보기 버튼 클릭 후 발동됨
const fetchMeetings = async () => {
  try {
    const response = await axiosInstance.get(`/meetings?nowDate=${nowDate}&count=${moreMeetingListCount}`);
    const data = await response.data;
    // 이전 리스트에 새로운 데이터를 추가
    setMoreMeetingList((prev) => [...prev, ...data]); // 비동기 결과 처리
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }
};
useEffect(() => {
  if (moreMeetingListCount !== 0) {
    fetchMeetings(); // 비동기 함수 호출
  }
}, [moreMeetingListCount]); // moreMeetingListCount가 변경될 때마다 실행됨

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
  setMoreMeetingListCount(0);
  setMoreMeetingList([]);
};


const handleTabChange = (event, newValue) => {
  setSelectedTab(newValue); // 클릭된 탭을 설정
};
const [passCategory, setPassCategory] = useState("푸드·드링크");

const handleCategoryTabChange = (event, newValue) => {
  setSelectedCategoryTab(newValue);
  setPassCategory(category[newValue]); // newValue를 이용해 해당 인덱스의 문자열 값 전달
};

  return (
    <Box sx={{ width: "100%", backgroundColor: "#F2F2F2", position: "relative" }}>
      <Container maxWidth="lg" sx={{ paddingBottom: "40px" }}>
        {/* 이미지 캐러셀 */}
        {/* <Box className="carousel-container" sx={{ position: 'relative' }}>
          <Box sx={{ display: "flex" }}>
            <Button
              className="prev-btn"
              onClick={prevImage}
              sx={{ color: 'black' }}
            >
              &#10094;
            </Button>
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
            <Button className="next-btn" onClick={nextImage} sx={{ color: 'black' }}>
              &#10095;
            </Button>
          </Box>
        </Box> */}

        <Box className="carousel-container" sx={{ position: 'relative' }}>
          <Box sx={{ display: "flex" }}>
            <Button
              className="prev-btn"
              onClick={prevImage}
              sx={{ color: 'black' }}
            >
              &#10094;
            </Button>
            <Box 
              className="carousel" 
              sx={{ 
                cursor: 'pointer', // 기본 커서 스타일
                '&:hover': {
                  cursor: 'pointer' // 호버 시 커서 모양 변경
                }
              }}
              onClick={() => navigate(`/event`)}
            >
              <motion.div className="image-frame">
                <motion.img
                  key={page}
                  src={events.length > 0 ? events[imageIndex(page)].cardImage : '/defaultImage.jpg'} // 기본 이미지 사용
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="carousel-image"
                />
              </motion.div>
            </Box>
            <Button className="next-btn" onClick={nextImage} sx={{ color: 'black' }}>
              &#10095;
            </Button>
          </Box>
        </Box>


        {isLoading && <div>Loading...</div>}
        {error && <div>Error fetching data</div>}
        

        {/* 모임 찾기 렌더링되는 카드 섹션 */}
        <Box sx={{ mt: 5, padding: '20px' }}>
          <Box sx={{ borderBottom: '3px solid black', mb: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
              모임 찾기
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'gray' ,
                cursor: 'pointer', // 기본 커서 스타일
                '&:hover': {
                  color: 'black', // 호버 시 색상도 변경하고 싶다면 추가
                  cursor: 'pointer' // 호버 시 커서 모양 변경
                }
              }}
              onClick={() => navigate(`/clubList`)}
            >
              더보기
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {clubsData && clubsData.map((club, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <HomeCard club={club} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 신규 모임 렌더링되는 카드 섹션 */}
        <Box sx={{ mt: 5, padding: '20px' }}>
          <Box sx={{ borderBottom: '3px solid black', mb: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
              신규 모임
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {newClubsData && newClubsData.map((club, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <HomeCard club={club} />
              </Grid>
            ))}
          </Grid>

          {/* 카드들을 중앙을 기준으로 회전시키는 컨테이너 */}
          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '230px',
              perspective: '10000px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '200px',
                height: '200px',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotation}deg)`,
                transition: 'transform 10s ease',
              }}
            >
              {newClubsData && newClubsData.map((club, idx) => {
                const angle = (idx / newClubsData.length) * 360; // 각도 계산

                return (
                  <Box
                    key={idx}
                    sx={{
                      position: 'absolute',
                      width: '120px', // 카드 크기 조정
                      height: '90px',
                      transform: `rotateY(${angle}deg) translateZ(250px)`, // Z축 이동값 증가
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <HomeCard club={club} />
                  </Box>
                );
              })}
            </Box>
          </Box> */}
        </Box>

        {/* 추천 모임 렌더링되는 카드 섹션 */}
        <Box sx={{ mt: 5, padding: '20px' }}>
          <Box sx={{ borderBottom: '3px solid black', mb: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
                추천 모임
              </Typography>
              <Tooltip
              title={tooltipText}
              arrow
              sx={{
                '& .MuiTooltip-tooltip': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // 흐린 회색 배경
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }
              }}
            >
              <IconButton sx={{ color: 'gray', fontSize: '1.5rem' }}>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'gray' ,
                cursor: 'pointer', // 기본 커서 스타일
                '&:hover': {
                  color: 'black', // 호버 시 색상도 변경하고 싶다면 추가
                  cursor: 'pointer' // 호버 시 커서 모양 변경
                }
              }}
              onClick={() => navigate(`/recommendedClubList`)}
            >
              더보기
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {recommendedClubsData && recommendedClubsData.map((club, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <HomeCard club={club} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 정모일정 */}
        <Box sx={{ mt: 5, padding: '20px' }}>
          <Box sx={{ borderBottom: '3px solid black', mb: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
              정모일정
            </Typography>
            <Typography 
            variant="body1" 
            sx={{ 
              color: 'gray' ,
              cursor: 'pointer', // 기본 커서 스타일
              '&:hover': {
                color: 'black', // 호버 시 색상도 변경하고 싶다면 추가
                cursor: 'pointer' // 호버 시 커서 모양 변경
              }
            }}
            onClick={() => navigate(`/meetingList`)}
            >
              더보기
            </Typography>
          </Box>
          <Container
        sx={{
          width: "100%",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#f2f2f2",
        }}
      >
        {/* 게시글들 분류 텝 */}
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

      <Container maxWidth="lg" sx={{ backgroundColor: "#f2f2f2", padding: "20px", borderRadius: "30px" }}>
        {/* 초기 모임리스트 4개만 */}
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {meetingList &&
            meetingList.slice(0, 4).map((meeting, index) => {
              const avatars = meeting?.joinMemberInfo.map((member, idx) => <Avatar key={idx} alt={member.img} src={member.thumbnailImage} sx={{ width: 32, height: 32 }} />);
              return (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  key={index}
                  onClick={() => {
                    navigate(`/clubs/main?clubNumber=${meeting.clubNumber}`);
                  }}
                  sx={{
                    height: "200px",
                    marginBottom: "10px",
                    cursor: "pointer", // 커서 포인터 추가
                    transition: "all 0.3s ease", // 부드러운 전환 효과 추가
                    "&:hover": {
                      // 호버 스타일 추가
                      backgroundColor: "#f0f0f0", // 호버 시 배경색 변경
                      transform: "scale(1.01)", // 호버 시 살짝 확대
                    },
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      padding: "16px",
                      display: "flex",
                      borderRadius: "20px",
                      transition: "all 0.3s ease", // 부드러운 전환 효과 추가
                      "&:hover": {
                        // 호버 스타일 추가
                        transform: "scale(1.02)", // 호버 시 살짝 확대
                      },
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
              );
            })}
        </Grid>
        {/* 초기 모임리스트 4개만.end */}

        {/* 더보기 후 불러오는 모임리스트 4개씩 */}
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {moreMeetingList &&
            moreMeetingList.slice(0, moreMeetingListCount * 4).map((meeting, index) => {
              const avatars = meeting?.joinMemberInfo.map((member, idx) => <Avatar key={idx} alt={member.img} src={member.thumbnailImage} sx={{ width: 32, height: 32 }} />);
              return (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  key={index}
                  onClick={() => {
                    navigate(`/clubs/main?clubNumber=${meeting.clubNumber}`);
                  }}
                  sx={{
                    height: "200px",
                    marginBottom: "10px",
                    cursor: "pointer", // 커서 포인터 추가
                    transition: "all 0.3s ease", // 부드러운 전환 효과 추가
                    "&:hover": {
                      // 호버 스타일 추가
                      backgroundColor: "#f0f0f0", // 호버 시 배경색 변경
                      transform: "scale(1.01)", // 호버 시 살짝 확대
                    },
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      padding: "16px",
                      display: "flex",
                      borderRadius: "20px",
                      transition: "all 0.3s ease", // 부드러운 전환 효과 추가
                      "&:hover": {
                        // 호버 스타일 추가
                        transform: "scale(1.02)", // 호버 시 살짝 확대
                      },
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
              );
            })}
        </Grid>
        {/* 더보기 후 불러오는 모임리스트 4개씩.end */}

        {/*처음에 불러오는 미팅리스트가 없을 때  */}
        {(!meetingList || meetingList.length === 0) && (
          <Grid item xs={12} sx={{ height: "200px", width: "100%", backgroundColor: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
            선택하신 날짜에 정기모임이 없습니다.
          </Grid>
        )}
        {/*처음에 불러오는 미팅리스트가 없을 때 .end */}

        {/* 미팅리스트 길이가 5일떄 -> 즉 더보기 눌러도 가져올 정보가 더 있을 때 버튼 보여주기 */}
        {moreMeetingListCount === 0 && meetingList && meetingList.length === 5 && (
          <Typography
            variant={"h6"}
            onClick={moreMeetingListHandler}
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
        )}
        {/* 미팅리스트 길이가 5일떄 -> 즉 더보기 눌러도 가져올 정보가 더 있을 때 버튼 보여주기.end */}

        {/* 더보기한 후 미팅리스트 길이가 5일떄 -> 즉 더보기 눌러도 가져올 정보가 더 있을 때 버튼 보여주기 */}
        {moreMeetingList && moreMeetingList.length === 5 && (
          <Typography
            variant={"h6"}
            onClick={moreMeetingListHandler}
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
        )}
        {/* 더보기한 후 미팅리스트 5일떄 -> 즉 더보기 눌러도 가져올 정보가 더 있을 때 버튼 보여주기.end */}
      </Container>



        </Box>

        {/* 이벤트 */}
        {/* <Box sx={{ mt: 5, padding: '20px' }}>
          <Box sx={{ borderBottom: '3px solid black', mb: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
              이벤트
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'gray' ,
                cursor: 'pointer', // 기본 커서 스타일
                '&:hover': {
                  color: 'black', // 호버 시 색상도 변경하고 싶다면 추가
                  cursor: 'pointer' // 호버 시 커서 모양 변경
                }
              }}
              onClick={() => navigate(`/event`)}
            >
              더보기
            </Typography>
          </Box>
        </Box> */}

      </Container>
    </Box>
  );
};

export default Home;