import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  Container,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import BrushIcon from "@mui/icons-material/Brush";
import ScubaDivingIcon from "@mui/icons-material/ScubaDiving";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import StarIcon from "@mui/icons-material/Star";
import FlightIcon from "@mui/icons-material/Flight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SavingsIcon from "@mui/icons-material/Savings";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import club from "../../../data/Club.js";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import PeopleIcon from "@mui/icons-material/People";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import axiosInstance from "./../../../utils/axios";
import {
  fetchCategoryClubList,
  fetchMeetingList,
} from "../../../store/reducers/clubReducer.js";
dayjs.locale("ko");

const Main = () => {
  const dispatch = useDispatch();
  //Clubmember=3 이란 거 가져오기 위해서!
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");
  //Clubmember=3 이란 거 가져오기 위해서!.end

  //정기모임 글 등록, 두번쨰 모달
  const [dateTime, setDateTime] = useState(null);
  const [checked, setChecked] = useState(false); // 정기모임 전체알림 스테이트
  const [category, setCategory] = useState("");
  const checkedChange = (event) => {
    setChecked(event.target.checked);
  };

  const [secondModal, setSecondModal] = useState(false);
  const secondModalClose = () => {
    setSecondModal(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    data.dateTime = dateTime.$d.toString();
    data.alertAll = checked;
    data.category = category;
    data.clubNumber = clubNumber;
    axiosInstance
      .post("http://localhost:4000/meetings/create", data)
      .then((response) => {
        alert("모임 만들기에 성공하쎴음");
        navigate(`/clubs/main?clubNumber=${clubNumber}`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("모임 만들기에 실패함");
      });
  };
  //정기모임 글 등록, 두번쨰 모달 .end

  //파일
  const [locationImg, setLocationImg] = useState(null);
  const handleLocationImgChange = (locationImg) => {
    setLocationImg(locationImg);
  };
  //파일.end
  const [list, setList] = useState(club);

  //모달창관련 스위치 및 State
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const fadStyle = {
    fontSize: "1.8rem",
    width: "70px",
    height: "70px",
    margin: "15px 0px 10px 0px",
  };
  const FadHandleClick = (event) => {
    const ariaLabel = event.currentTarget.getAttribute("aria-label");
    setCategory(ariaLabel);
    setOpen(false);
    setSecondModal(true);
  };
  //모달창관련.end

  // 클럽 리스트 where redux
  const getCategoryClubList = useSelector((state) => state.categoryClub);
  const [clubList, setClubList] = useState([]);
  useEffect(() => {
    let copy = [];
    for (let i = 0; i < getCategoryClubList.clubs.length; i++) {
      if (
        getCategoryClubList.clubs[i]._id.toString() !==
        queryParams.get("clubNumber")
      ) {
        copy.push(getCategoryClubList.clubs[i]);
      }
    }
    setClubList(copy);
  }, [getCategoryClubList]);
  // 클럽 리스트 where redux. end

  //로그인 정보 where redux
  const user = useSelector((state) => state.user);
  const meetingList = useSelector((state) => state.meetingList);
  const [meeetingListBoolean, setMeeetingListBoolean] = useState([]);
  useEffect(() => {
    dispatch(fetchMeetingList(clubNumber));
    let copy = [];
    console.log(`meetingList`);
    console.log(meetingList);
    console.log(`meetingList`);
    console.log(`user.userData.user.email`);
    console.log(user.userData.user.email);
    console.log(`user.userData.user.email`);

    for (let i = 0; i < meetingList.meetings.length; i++) {
      if (
        meetingList.meetings[i].joinMember.includes(user.userData.user.email)
      ) {
        //미팅리스트에서의 조인멤버 안에 로긴한 사람 들가있다면
        copy.push(true);
      } else {
        copy.push(false);
      }
    }
    setMeeetingListBoolean(copy);
  }, [clubNumber]);
  //로그인 정보 where redux.end

  //미팅 지우기
  const deleteMeeting = async (meetingNumber) => {
    const response = await fetch(
      `http://localhost:4000/meetings/delete/` + meetingNumber
    );
    window.location.reload();
  };
  //미팅 지우기.end

  //이미지를 위해서
  const [club2] = useState(club);
  const navigate = useNavigate();

  const getReadClub = async () => {
    const response = await fetch(
      `http://localhost:4000/clubs/read2/${clubNumber}`
    );
    const data = await response.json();
    dispatch(fetchCategoryClubList(data.mainCategory));
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
    navigate(`/clubs/main/update?clubNumber=${clubNumber}`);
    handleClose();
  };

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

  //정모 참석하기 버튼 눌렀을 때 , 콜백함수
  const meetingJoin = (meetingId) => {
    if (!user.userData.user.email) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/login");
    } else {
      axiosInstance
        .post(`/meetings/join/${meetingId}`)
        .then((response) => {
          dispatch(fetchMeetingList(clubNumber));
          let copy = [];
          for (let i = 0; i < meetingList.meetings.length; i++) {
            if (
              meetingList.meetings[i].joinMember.includes(
                user.userData.user.email
              )
            ) {
              copy.push(true);
            } else {
              copy.push(false);
            }
          }
          setMeeetingListBoolean(copy);
          if (response.data.message === "참석 취소") {
            alert("참석 취소");
          } else {
            alert("참석 성공");
          }
          navigate("/mypage/wish");
        })
        .catch((err) => {
          console.error(err);
          alert("참석 실패");
        });
    }
  };
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
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: 430,
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            관심사 선택
          </Typography>
          <hr />
          <Grid container spacing={2}>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="0"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "green" }}
              >
                <BrushIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="1"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "blue" }}
              >
                <ScubaDivingIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="2"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "#B2561A" }}
              >
                <FastfoodIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="3"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "yellow" }}
              >
                <StarIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>문화·예술</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>액티비티</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>푸드·드링크</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>취미</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="4"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "skyblue" }}
              >
                <FlightIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="5"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "brown" }}
              >
                <MenuBookIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="6"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "#D6B095" }}
              >
                <Diversity3Icon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="7"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "#B855B9" }}
              >
                <CelebrationIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>여행·동행</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>자기계발</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>동네·또래</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>파티·게임</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="8"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "#F47378" }}
              >
                <SavingsIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab aria-label="9" onClick={FadHandleClick} sx={fadStyle}>
                <CastForEducationIcon />
              </Fab>
            </Grid>
            <Grid
              item
              xs={3}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Fab
                aria-label="10"
                onClick={FadHandleClick}
                sx={fadStyle}
                style={{ color: "red" }}
              >
                <FavoriteOutlinedIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>재테크</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>외국어</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>연애·사랑</Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* 모달창.end */}
      {/* 모달창.end */}
      {/* 모달창.end */}
      {/* 모달창.end */}
      {/* 모달창.end */}

      {/* 2번째 글등록 모달창 */}
      {/* 2번째 글등록 모달창 */}
      {/* 2번째 글등록 모달창 */}
      {/* 2번째 글등록 모달창 */}

      <Modal
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        open={secondModal}
        onClose={secondModalClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: 430,
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <MuiFileInput
                inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                value={locationImg}
                onChange={handleLocationImgChange}
                multiple
                size="small"
                fullWidth
                sx={{
                  width: "100%",
                  height: "90%",
                  "& .MuiInputBase-root": { height: "100%" },
                }}
              />
            </Grid>
            <Grid item xs={7} container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  id="title"
                  label="정모 제목"
                  multiline
                  sx={{ width: "100%", mb: 2 }}
                  {...register("title", { required: " 필수입력 요소." })}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      id="dateTime"
                      label="만나는 날짜 및 시간"
                      onChange={(date) => {
                        setDateTime(date);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="cost"
                  label="비용"
                  multiline
                  sx={{ width: "100%", mb: 2 }}
                  {...register("cost", { required: " 필수입력 요소." })}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="where"
                label="위치"
                multiline
                placeholder="모임 장소를 입력하세요"
                sx={{ width: "100%", mb: 2 }}
                {...register("where", { required: " 필수입력 요소." })}
              />
            </Grid>
            <Grid container spacing={1} sx={{ marginLeft: "3px" }}>
              <Grid
                item
                xs={4}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="totalCount"
                  label="인원 수"
                  placeholder="숫자만 입력하세요"
                  multiline
                  sx={{ width: "100%", mb: 2 }}
                  {...register("totalCount", { required: " 필수입력 요소." })}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: "20px", paddingTop: "15px" }}>
                    정모 공지{" "}
                    <span style={{ color: "gray" }}>(전체 멤버 알림)</span>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2} sx={{ marginLeft: "0px" }}>
                <Checkbox
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                  onChange={checkedChange}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Button type="submit" variant="contained" sx={{ width: "100%" }}>
                등록하기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* 2번째 글등록 모달창.end */}
      {/* 2번째 글등록 모달창.end */}
      {/* 2번째 글등록 모달창.end */}

      <Container maxWidth="md" sx={{ padding: "0px !important" }}>
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
      <Container maxWidth="md" sx={{ backgroundColor: "white" }}>
        {/* 모달창 버튼*/}
        {readClub.admin === user.userData.user.email && (
          <>
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
          {readClub.meeting.length === 0 &&
            user.userData.user.email !== readClub.admin && (
              <Box>아직 정기모임이 없습니다.</Box>
            )}
          {readClub.meeting.length === 0 &&
            user.userData.user.email === readClub.admin && (
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
                      <Grid
                        item
                        xs={12}
                        sx={{ fontWeight: 600, fontSize: "18px" }}
                      >
                        아직 정모가 없어요!
                      </Grid>
                      <Grid item xs={12} sx={{ marginBottom: "35px" }}>
                        정모를 만들어보세요
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleOpen}
                          sx={{
                            width: "100%",
                            fontSize: "18px",
                            borderRadius: "15px",
                          }}
                        >
                          정모 만들기
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          {readClub.meeting.map((a, i) => {
            return (
              <Grid container spacing={1}>
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
                          onClick={() => {
                            meetingJoin(readClub.meeting[i]._id);
                          }}
                          variant={
                            meeetingListBoolean[i] ? "outlined" : "contained"
                          }
                          sx={{ borderRadius: "20px" }}
                        >
                          {meeetingListBoolean[i] ? "취소" : "참석하기"}
                        </Button>
                        {user.userData.user.email === readClub.admin && (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              deleteMeeting(readClub.meeting[i]._id);
                            }}
                            sx={{ borderRadius: "20px" }}
                          >
                            삭제하기
                          </Button>
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
                            {readClub.meeting[i].joinMember.length}/
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
          {readClub.meeting.length !== 0 &&
            user.userData.user.email === readClub.admin && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  sx={{ width: "100%", fontSize: "18px", borderRadius: "15px" }}
                >
                  정모 만들기
                </Button>
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
                새로운 목표를 같이 달성해보고 싶어요. 서로의 고민이나 생각을
                나누며 함께 성장해보고 싶어요
              </Grid>
            </Grid>
          </Grid>
          <hr></hr>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: "#feebea",
              height: "200px",
              borderRadius: "20px",
            }}
          ></Grid>
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
          {clubList.length !== 0 && (
            <Grid
              item
              onClick={() => {
                navigate(`/clubs/main?clubNumber=${clubList[0]._id}`);
                window.location.reload();
              }}
              xs={12}
              sm={12}
              md={6}
              sx={{ height: "200px", marginBottom: "30px" }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "15px",
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
                      src={list[0].src} // 이미지 경로
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
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "700",
                      fontSize: "20px",
                      color: "#383535",
                      paddingTop: "10px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {clubList[0].title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "500",
                      fontSize: "18px",
                      color: "#666666",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {clubList[0].subTitle}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "left",
                      color: "#9F9E9D",
                      display: "inline-flex",
                    }}
                  >
                    {clubList[0].mainCategory} ·
                  </Typography>
                  <CommentRoundedIcon
                    sx={{ color: "#BF5B16", fontSize: "18px" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "#BF5B16", display: "inline-flex" }}
                  >
                    {" "}
                    {list[0].chat}
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
                      <span style={{ marginLeft: "5px" }}></span>
                    </Box>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          )}
          {/* 비슷한 클럽.end */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Main;
