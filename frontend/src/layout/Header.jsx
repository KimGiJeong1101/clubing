import React ,{ useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Container } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  //스크롤에 따라 보이고 안보이고 
const homeLocation = useSelector((state) => state.user.userData.homeLocation);

// useEffect(()=>{
  
// },[homeLocation])
  const navigate = useNavigate();
  
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
      <Container maxWidth="lg" sx={{ padding: "0px !important" }}>
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
              }}
            ></ArrowBackIosIcon>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "black" }}
            >
              {homeLocation && <p>{homeLocation}</p>}
              {!homeLocation && <p>로그인 정보가 없습니다.</p>}
            </Typography>
            <Button variant="" onClick={() => {
                navigate('/login');
              }}>로그인</Button>
               <Button variant="" onClick={() => {
                // 버튼 눌렀을 때 , 형이 할 행동들!!
              }}>로그아웃</Button>
            <Button variant="" onClick={() => {
                navigate('/register');
              }}>회원가입</Button>
            <FavoriteIcon
              onClick={() => {
              }}
              sx={{ padding: "7px", color: "gray",":hover":{
                cursor:'pointer'
              } }}
            />
            <ShareOutlinedIcon 
              onClick={() => {
              }}
            sx={{ padding: "7px", color: "black" }} />
            <MenuIcon sx={{ padding: "7px", color: "black" }} />
          </Toolbar>
        </Box>
      </Container>
    </Box>
  );
}

export default Header;
