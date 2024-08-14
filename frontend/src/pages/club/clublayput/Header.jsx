import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetClub
} from "../../../store/reducers/clubReducer";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const getClub = useSelector((state) => state.getClub);
  const navigate = useNavigate();
  // URL에서 ID 추출
  //Clubmember=3 이란 거 가져오기 위해서!
  
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  useEffect(() => {
    if (clubNumber) {
      dispatch(fetchGetClub(clubNumber));
      console.log("제발");
      console.log(getClub);
    }
  }, [dispatch, clubNumber]);

  // 클럽 리스트 불러오는 거 ! redux 이용
  // const getClubList = useSelector((state) => state.clubList);
  // const [clubList, setClubList] = useState([]);
  // useEffect(() => {
  //   if (getClubList.status === "succeeded") {
  //     setClubList(getClubList.clubs);
  //   }
  // }, [getClubList]);
  // 클럽 리스트 불러오는 거 ! redux 이용.end

  //하트 아이콘 색깔 state
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "64px",
        backgroundColor: "white",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100, // Material-UI의 기본 z-index보다 높은 값 설정
      }}
    >
      <Container maxWidth="md" sx={{ padding: "0px !important" }}>
        <Box>
          <Toolbar sx={{ padding: "0px !important" }}>
            <ArrowBackIosIcon
              sx={{
                color: "black",
                marginRight: "5px",
                "&:hover": {
                  color: "gray",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                navigate('/clublist');
              }}
            ></ArrowBackIosIcon>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "black" }}
            >
              {getClub.clubs.title}
            </Typography>
            <FavoriteIcon
              onClick={() => {
                setIsFavorite(!isFavorite);
              }}
              sx={{ padding: "7px", color: isFavorite ? "lightcoral" : "gray",":hover":{
                cursor:'pointer'
              } }}
            />
            <ShareOutlinedIcon sx={{ padding: "7px", color: "black" }} />
            <MenuIcon sx={{ padding: "7px", color: "black" }} />
          </Toolbar>
        </Box>
      </Container>
    </Box>
  );
}

export default Header;
