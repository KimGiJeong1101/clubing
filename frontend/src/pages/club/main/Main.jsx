import { Avatar, AvatarGroup, Box, Container, Fab, Grid, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import club from "../../../data/Club.js";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import PeopleIcon from "@mui/icons-material/People";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import axiosInstance from "./../../../utils/axios";
import { fetchCategoryClubList, fetchMeetingList } from "../../../store/reducers/clubReducer.js";
import CustomButton from "../../../components/club/CustomButton.jsx";
import MeetingCreate1 from "../meeting/MeetingCreate1.jsx";
import MeetingCreate2 from "../meeting/MeetingCreate2.jsx";
import ClubCarousel from "../../../components/club/ClubCarousel.jsx";
dayjs.locale("ko");

const Main = () => {
  //리덕스 함수 부르기 위해서
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //멤버들 숨겼다가 나왔다가
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  //Clubmember=3 이란 거 가져오기 위해서!
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");
  //Clubmember=3 이란 거 가져오기 위해서!.end

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [clubNumber]);

  //정기모임 글 등록, 두번쨰 모달
  const [category, setCategory] = useState("");
  const [secondModal, setSecondModal] = useState(false);
  const secondModalClose = () => {
    setSecondModal(false);
  };
  //정기모임 글 등록, 두번쨰 모달 .end

  //모달창관련 스위치 및 State
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const FadHandleClick = (event) => {
    const ariaLabel = event.currentTarget.getAttribute("aria-label");
    setCategory(ariaLabel);
    setOpen(false);
    setSecondModal(true);
  };
  //모달창관련.end

  //카테고리로 같이 연관된 모임 추천해주려고
  const getCategoryClubList = useSelector((state) => state.categoryClub);
  const [clubList, setClubList] = useState([]);
  useEffect(() => {
    let copy = [];
    for (let i = 0; i < getCategoryClubList.clubs.length; i++) {
      if (getCategoryClubList.clubs[i]._id.toString() !== queryParams.get("clubNumber")) {
        copy.push(getCategoryClubList.clubs[i]);
      }
    }
    setClubList(copy);
  }, [getCategoryClubList]);
  //카테고리로 같이 연관된 모임 추천해주려고.end

  //로그인 정보 where redux
  const user = useSelector((state) => state.user);
  const [meetingList, setMeetingList] = useState([]);
  const [meeetingListBoolean, setMeeetingListBoolean] = useState([]);

  //로그인 정보 where redux.end

  //미팅 지우기
  const deleteMeeting = async (meetingNumber) => {
    const response = await fetch(`http://localhost:4000/meetings/delete/` + meetingNumber);
    window.location.reload();
  };
  //미팅 지우기.end

  //클럽read할 때 내용들 불러오기 -> react-Query로!
  const getReadClub = async () => {
    const response = await fetch(`http://localhost:4000/clubs/read2/${clubNumber}`);
    const data = await response.json();
    await dispatch(fetchCategoryClubList(data.mainCategory));
    return data;
  };
  //클럽read할 때 내용들 불러오기 -> react-Query로!.end
  const {
    data: readClub,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["readClub", clubNumber],
    queryFn: getReadClub,
    enabled: !!clubNumber, //
  });

  //메인에서의 모임수정 및 모임삭제관련 모달
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //메인에서의 모임수정 및 모임삭제관련 모달.end

  //모임수정 시 이동 핸들러
  const handleUpdate = () => {
    navigate(`/clubs/main/update?clubNumber=${clubNumber}`);
    handleClose();
  };
  //모임수정 시 이동 핸들러.end

  //모임삭제 시 이동 핸들러
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/clubs/delete/${clubNumber}`);
      // 삭제 후 원하는 페이지로 이동
      navigate("/clublist");
      alert("삭제 완료");
    } catch (error) {
      console.error("삭제 실패:", error);
    }
    handleClose();
  };
  //모임삭제 시 이동 핸들러.end

  //정모 참석하기 버튼 눌렀을 때 , 콜백함수
  const meetingJoin = (meetingId) => {
    if (!user.userData.user.email) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/login");
    } else {
      axiosInstance
        .post(`/meetings/join/${meetingId}`)
        .then((response) => {
          axiosInstance.get(`http://localhost:4000/meetings/${clubNumber}`).then((response) => {
            let copy = [];
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].joinMember.includes(user.userData.user.email)) {
                copy.push(true);
              } else {
                copy.push(false);
              }
            }
            setMeetingList([...response.data]);
            setMeeetingListBoolean(copy);
          });
          if (response.data.message === "참석 취소") {
            alert("참석 취소");
          } else {
            alert("참석 성공");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("참석 실패");
        });
    }
  };
  useEffect(() => {
    axiosInstance.get(`http://localhost:4000/meetings/${clubNumber}`).then((response) => {
      let copy = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].joinMember.includes(user.userData.user.email)) {
          copy.push(true);
        } else {
          copy.push(false);
        }
      }
      setMeetingList([...response.data]);
      setMeeetingListBoolean(copy);
    });
  }, []);
  //////리엑트 쿼리
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ backgroundColor: "#F4F4F4" }}>
      {/* 모달창 */}
      {open && <MeetingCreate1 open={open} handleCloseModal={() => setOpen(false)} FadHandleClick={FadHandleClick} />}
      {/* 모달창.end */}

      {/* 2번째 글등록 모달창 */}
      {secondModal && <MeetingCreate2 clubNumber={clubNumber} secondModalClose={secondModalClose} secondModal={secondModal} />}
      {/* 2번째 글등록 모달창.end */}

      <Container maxWidth="md" sx={{ padding: "0px !important" }}>
        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: "10px",
              width: "100%",
              height: "478.5px",
              overflow: "hidden", // 박스 영역을 넘어서는 이미지 잘리기
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0", // 박스 배경 색상 (선택 사항)
            }}
          >
            <img
              src={`http://localhost:4000/` + readClub?.img} // 이미지 경로
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
      <Container maxWidth="md" sx={{ backgroundColor: "white" }}>
        {/* 모달창 버튼*/}
        {readClub.admin === user.userData.user.email && (
          <>
            <Fab
              onClick={handleClick}
              aria-label="add"
              sx={{
                backgroundColor: "#DBC7B5",
                color: "white",
                position: "fixed",
                bottom: "200px",
                right: "100px",
                "&:hover": {
                  backgroundColor: "#A67153", // hover 시 배경 색상 변경
                },
              }}
            >
              <AddIcon />
            </Fab>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleUpdate}>모임 및 게시글 수정</MenuItem>
              <MenuItem onClick={handleDelete}>모임 삭제</MenuItem>
            </Menu>
          </>
        )}

        {/* 모달창 버튼.end */}
        <Grid item xs={12} sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
          <Grid container>
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
                호스트 <b> {readClub.adminNickName}</b>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: "#555555" }}>
              <b> 1</b>/{readClub.maxMember}명<b> {readClub.meeting.length}</b> 정기모임
              <b> 0</b> 글 갯수
              <b> 5</b> 분 전 대화
            </Grid>
          </Grid>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: "30px" }}>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>{readClub.content}</Typography>
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
          {readClub.meeting.length === 0 && user.userData.user.email !== readClub.admin && <Box>아직 정기모임이 없습니다.</Box>}
          {readClub.meeting.length === 0 && user.userData.user.email === readClub.admin && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ marginBottom: "30px" }}>
                <Paper
                  elevation={5}
                  sx={{
                    padding: "16px",
                    display: "flex",
                    borderRadius: "20px",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ fontWeight: 600, fontSize: "18px" }}>
                      아직 정모가 없어요!
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: "35px" }}>
                      정모를 만들어보세요
                    </Grid>
                    <Grid item xs={12}>
                      <CustomButton
                        variant="contained"
                        onClick={handleOpen}
                        sx={{
                          width: "100%",
                          fontSize: "18px",
                          borderRadius: "15px",
                          backgroundColor: "#DBC7B5",
                        }}
                      >
                        정모 만들기
                      </CustomButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
          {readClub.meeting.map((a, i) => {
            return (
              <Grid container spacing={1} key={i}>
                <Grid item xs={12} sx={{ height: "250px", marginBottom: "30px" }}>
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
                          src={`http://localhost:4000/` + readClub?.meeting[i]?.img} // 이미지 경로
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
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <CustomButton
                          onClick={() => {
                            meetingJoin(readClub.meeting[i]._id);
                          }}
                          variant={meeetingListBoolean[i] ? "outlined" : "contained"}
                          sx={{ borderRadius: "20px", backgroundColor: "#DBC7B5" }}
                        >
                          {meeetingListBoolean[i] ? "취소" : "참석하기"}
                        </CustomButton>
                        {user.userData.user.email === readClub.admin && (
                          <CustomButton
                            variant="outlined"
                            onClick={() => {
                              deleteMeeting(readClub.meeting[i]._id);
                            }}
                            sx={{ borderRadius: "20px", border: "#DBC7B5 1px solid" }}
                          >
                            삭제하기
                          </CustomButton>
                        )}
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
                          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
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
                            {meetingList[i]?.joinMember?.length}/{meetingList[i]?.totalCount}
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
          {readClub.meeting.length !== 0 && user.userData.user.email === readClub.admin && (
            <Grid item xs={12}>
              <CustomButton variant="contained" onClick={handleOpen} sx={{ width: "100%", fontSize: "18px", borderRadius: "15px", backgroundColor: "#DBC7B5" }}>
                정모 만들기
              </CustomButton>
            </Grid>
          )}
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
                  {readClub.adminNickName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                새로운 목표를 같이 달성해보고 싶어요. 서로의 고민이나 생각을 나누며 함께 성장해보고 싶어요
              </Grid>
            </Grid>
          </Grid>
          <hr></hr>
          <Box sx={{ fontSize: "18px", fontWeight: "600" }}>모임 멤버 ({readClub.members.length})</Box>
          <Grid
            item
            xs={12}
            sx={{
              height: isExpanded ? "auto" : "200px",
              overflow: "hidden",
              borderRadius: "20px",
              transition: "height 0.3s ease",
              position: "relative", // For absolute positioning of the button
              backgroundColor: "#f2f2f2",
            }}
          >
            {readClub.clubmembers &&
              readClub.clubmembers.map((member, index) => (
                <Grid container sx={{ cursor: "pointer", padding: "5px" }} key={index}>
                  <Grid item xs={1}>
                    <Avatar sx={{ width: 50, height: 50 }} src={member?.thumbnailImage || ""} />
                  </Grid>
                  <Grid item xs={4} sx={{ marginTop: "8px" }}>
                    <Typography variant="h6">{member.name}</Typography>
                  </Grid>
                  {index === 0 && (
                    <Grid item xs={7} sx={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                      <CustomButton variant="contained" sx={{ color: "white", backgroundColor: "#DBC7B5", marginRight: "10px", borderRadius: "10px" }}>
                        1:1 문의하기
                      </CustomButton>
                    </Grid>
                  )}
                </Grid>
              ))}
            {readClub?.clubmembers?.length > 3 && (
              <CustomButton
                onClick={toggleExpand}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "#DBC7B5",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                {isExpanded ? "멤버 숨기기" : "멤버 전부보기"}
              </CustomButton>
            )}
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
          {clubList.length > 1 ? <ClubCarousel clubList={clubList} /> : <Box sx={{ height: "200px", alignItems: "center" }}> 같은 카테고리 관련 클럽이 적습니다 </Box>}
          {/* 비슷한 클럽.end */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Main;
