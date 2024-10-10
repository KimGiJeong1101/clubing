import React, { useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import club from "../../data/Club.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeEnterChat } from "../../store/actions/chatActions.js";

const ClubCard3 = ({ clubList }) => {
  const [list, setList] = useState(club);
  const user = useSelector((state) => state.user?.userData?.user || {});
  console.log(user.email);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user?.userData?.user?._id);
  
  const handleClickChat = async (clubId) => {
    const clubNumber = clubId;

    // 채팅방을 구성하려면 최소한의 유저와 해당 모임의 번호나 제목이 필요해서 최초에 userId, clubNumber 여부로 에러를 체크한다
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

      // 실제 참여자 ID 리스트 (밑에 선언되어 있는 makeEnterChat 함수를 정상적으로 실행하기 위해 필요한 파라미터 값을 선언해서 세팅해준다)
      // 그리고 참여자는 여러명이고, 스키마에 배열로 되어 있어서 const participants = [userId]; 이렇게 선언해줬다
      const participants = [userId];
      console.log("Participants array before sending:", participants);

      // 채팅방 생성
      const actionResult = await dispatch(makeEnterChat({ clubId: clubNumber, participants })); // 이제 여기서 함수가 실행된다.
      console.log("Action result:", actionResult);

      // 서버로부터 받은 응답 처리
      const chattingRoom = actionResult.payload; // 위의 함수가 성공적으로 실행이 되었다면 서버에서 받은 데이터가 있을텐데 payload안에 담긴다

      // 채팅방 정보가 없다면 에러를 던짐
      // 이건 말 그대로 채팅방이 없거나 에러가 나면 에러를 던짐
      if (!chattingRoom) {
        throw new Error("채팅방 정보를 불러오는 데 실패했습니다.");
      }

      // 채팅방으로 이동 (chattingRoom._id는 필요 없으므로 clubNumber만 사용)
      console.log("Chat room data:", chattingRoom);

      navigate(`/clubs/chat?clubNumber=${clubNumber}`); // 위에 모든 로직이 이루어진뒤에 해당 URL로 이동
    } catch (error) {
      // 에러 메시지 출력
      console.error("Error entering chat room:", error.message || error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {clubList.map((club, index) => (
          <Grid
            item
            md={11}
            key={club._id}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "480px",
                height: "205px",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease",
                backgroundColor: "white",
                position: "relative", // Paper의 상대적인 위치 기준 설정
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={() => handleClickChat(club._id)}
            >
              {/* 클럽 */}
              <Grid container spacing={3}>
                <Grid item xs={5}>
                  <Box sx={{ display: "flexed", position: "relative" }}>
                    <img
                      src={`http://localhost:4000/` + club.img}
                      alt={club.title}
                      style={{
                        width: "190px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        marginLeft: "10px",
                        marginTop: "10px",
                        border: "1px solid #F2F2F2", // 테두리 추가
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box
                    sx={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      height: "182px",
                    }}
                  >
                    {/* 클럽 제목 */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#383535",
                        marginBottom: "8px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {club.title}
                    </Typography>
                    {/* 클럽 제목.end */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "500",
                        fontSize: "18px",
                        color: "#777777",
                        marginBottom: "8px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {club.subTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9F9E9D",
                        marginBottom: "8px",
                      }}
                    >
                      {club.region.district}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CommentRoundedIcon sx={{ color: "#BF5B16", fontSize: "18px" }} />
                      <Typography variant="body2" sx={{ color: "#BF5B16", marginLeft: "5px" }}>
                        {list[index].chat}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "auto",
                        borderTop: "1px solid #e0e0e0",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      <AvatarGroup max={4}>
                        {club.members.map((member, idx) => (
                          <Avatar key={idx} alt={`Member ${idx + 1}`} src={member.img} sx={{ width: 32, height: 32 }} />
                        ))}
                      </AvatarGroup>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "8px",
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                        <span style={{ marginLeft: "5px" }}>
                          {club.members.length}/{club.maxMember}
                        </span>
                      </Box>
                    </Box>
                    {/* 내가 만든 모임 표시 */}
                    {club.admin === user.email && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "#BF5B16",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          zIndex: 1, // Typography를 가장 위에 표시
                        }}
                      >
                        내가 만든 모임
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClubCard3;
