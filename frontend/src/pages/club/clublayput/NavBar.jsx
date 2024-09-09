import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { enterChatRoom } from "../../../store/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";

function NavBar() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");
  const [showNavbar, setShowNavbar] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState("홈");

  const userId = useSelector((state) => state.user?.userData?.user?._id);

  console.log("유저아이디 뭐찍힘" + userId);

  const handleClickChat = async () => {
    try {
      // userId가 없다면 콘솔에 에러 메시지 출력 후 종료
      if (!userId) {
        console.error("User ID is missing.");
        return; // 유저 ID가 없으면 채팅방 생성하지 않음
      }

      // clubNumber가 없다면 에러를 던짐
      if (!clubNumber) {
        throw new Error("클럽 번호가 없습니다."); // 필수 정보 체크
      }

      const participants = [userId]; // 실제 참여자 ID 리스트
      console.log("Participants array before sending:", participants);

      // 채팅방 생성
      const actionResult = await dispatch(enterChatRoom({ clubId: clubNumber, participants }));
      const chatRoom = actionResult.payload; // payload가 undefined일 수 있으므로 안전하게 접근

      // 채팅방 정보가 없다면 에러를 던짐
      if (!chatRoom || !chatRoom._id) {
        throw new Error("채팅방 정보를 불러오는 데 실패했습니다.");
      }

      // 채팅방으로 이동
      console.log("Chat room data:", chatRoom);
      navigate(`/clubs/chat/${chatRoom._id}?clubNumber=${clubNumber}`);
    } catch (error) {
      // 에러 메시지 출력
      console.error("Error entering chat room:", error.message || error);
    }
  };

  // 현재 URL을 기준으로 선택된 항목을 결정
  const getSelected = () => {
    const path = location.pathname;
    if (path.includes("board")) return "게시판";
    if (path.includes("gallery")) return "사진첩";
    if (path.includes("chat")) return "채팅";
    return "홈"; // 기본값
  };

  // 선택된 항목을 현재 URL과 비교하여 상태를 설정
  React.useEffect(() => {
    setSelected(getSelected());
  }, [location.pathname]);

  const navItems = [
    { name: "홈", path: `/clubs/main?clubNumber=${clubNumber}` },
    { name: "게시판", path: `/clubs/board?clubNumber=${clubNumber}` },
    { name: "사진첩", path: `/clubs/gallery?clubNumber=${clubNumber}` },
    {
      name: "채팅",
      path: "#", // 링크가 아닌 버튼 역할
      onClick: handleClickChat,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "114px" }}>
      <Box
        sx={{
          // position: "fixed",
          // top: "85px", // Header의 높이만큼 떨어뜨림
          // left: 0,
          marginTop: "-15px",
          width: "100%",
          height: "50px",
          backgroundColor: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100, // Header와 동일한 z-index로 설정
          transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <Container maxWidth="lg" sx={{ padding: "0px !important" }}>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            {navItems.map((item) => (
              <Grid
                item
                xs={3}
                mt={2.5}
                key={item.name}
                component={Link} // 기본 Link 컴포넌트 사용
                to={item.path}
                sx={{
                  height: "50px",
                  position: "relative",
                  textDecoration: "none", // 기본 링크 스타일 제거
                  cursor: "pointer",
                  color: selected === item.name ? "black" : "rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    color: "gray",
                    cursor: "pointer",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    width: selected === item.name ? "70%" : "0%",
                    height: "2px",
                    backgroundColor: "#595959",
                    transform: "translateX(-50%)",
                    transition: "width 0.3s ease",
                  },
                }}
              >
                {item.name}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default NavBar;
