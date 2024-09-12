import React, { useEffect, useState } from "react";
import MainHeader from "../../../layout/Header";
import MainFooter from "../../../layout/Footer";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Container, Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axiosInstance from "../../../utils/axios";
import { fetchGetClub } from "../../../store/reducers/clubReducer";
import { useDispatch, useSelector } from "react-redux";

function ClubLayout() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getClub = useSelector((state) => state.getClub);
  const user = useSelector((state) => state.user.userData.user);

  const [isFavorite, setIsFavorite] = useState(false);
  const [joinHandler, setJoinHandler] = useState(false);

  useEffect(() => {
    if (clubNumber) {
      dispatch(fetchGetClub(clubNumber));
    }
  }, [dispatch, clubNumber]);

  useEffect(() => {
    if (getClub.clubs && user.email) {
      setJoinHandler(!getClub.clubs.members.includes(user.email));
      setIsFavorite(getClub.clubs.wishHeart.includes(user.email));
    }
  }, [getClub, user.email, clubNumber]);

  const handleOpen = () => {
    if (user.email === "") {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      axiosInstance
        .post(`http://localhost:4000/clubs/addMember/${clubNumber}`)
        .then((response) => {
          alert("모임 가입성공");
          navigate(`/mypage/wish`);
        })
        .catch((err) => {
          console.log(err);
          alert("모임 가입에 실패했습니다.");
        });
    }
  };
  // 찜하기

  useEffect(() => {
    if (getClub.clubs && user.email) {
      // 클럽의 찜 목록(wishHeart)에 유저 이메일이 포함되어 있는지 확인
      setIsFavorite(getClub.clubs.wishHeart.includes(user.email));
    }
  }, [getClub, user.email]);

  const handleFavoriteToggle = () => {
    if (user.email === "") {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const url = isFavorite
      ? `/clubs/removeWish/${clubNumber}` // 찜 해제 API (추가 필요)
      : `/clubs/addWish/${clubNumber}`;

    axiosInstance
      .post(url)
      .then(() => {
        setIsFavorite(!isFavorite); // 찜 상태 토글
      })
      .catch((err) => {
        console.log(err);
        alert("찜하기에 실패했습니다.");
      });
  };

  return (
    <Box>
      <MainHeader />
      {/* <Header />  */}
      <NavBar />
      <main>
        <Outlet />
        {joinHandler && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1200,
            }}
          >
            <Container maxWidth="sm">
              <Grid container>
                <Grid
                  item
                  xs={1}
                  sx={{
                    backgroundColor: "#F0EDED",
                    textAlign: "center",
                    borderRadius: "20px 0px 0px 20px",
                  }}
                >
                  <FavoriteIcon
                    onClick={handleFavoriteToggle}
                    sx={{
                      fontSize: "26px",
                      padding: "7px",
                      color: isFavorite ? "lightcoral" : "gray",
                      ":hover": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={11} sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                      width: "100%",
                      fontSize: "18px",
                      borderRadius: "0px 20px 20px 0px",
                    }}
                  >
                    모임 가입하기
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}
      </main>
      <Footer />
      <MainFooter />
    </Box>
  );
}

export default ClubLayout;
