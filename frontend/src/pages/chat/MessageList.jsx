import React, { useRef, useEffect, useState } from "react";
import { Grid, Typography, Box, Modal } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

// 시간 형식 변환 함수
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const adjustedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${ampm} ${adjustedHours}:${formattedMinutes}`;
};

// 메시지 날짜별 그룹화
const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});
};

// 사용자 정보 가져오기
const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:4000/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { name: "Unknown" };
  }
};

const MessageList = ({ messages, userId, handleScroll, isAtBottom, onImageClick }) => {
  const containerRef = useRef(null);
  const [userNames, setUserNames] = useState({});
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // 현재 로그인된 사용자 데이터
  const userData = useSelector((state) => state.user.userData.user);
  const username = userData.name;

  // 이미지 클릭 핸들러
  const handleImageClick = (url) => {
    setCurrentImage(url);
    setOpen(true);
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpen(false);
    setCurrentImage("");
  };

  // 사용자 정보를 비동기적으로 가져오는 함수
  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueUserIds = [...new Set(messages.map((msg) => msg.sender)), userId];
      const userData = await Promise.all(uniqueUserIds.map(fetchUserById));

      const userMap = uniqueUserIds.reduce((acc, id, index) => {
        acc[id] = userData[index].name;
        return acc;
      }, {});

      setUserNames(userMap);
    };

    fetchUsers();
  }, [messages, userId]);

  // 스크롤 위치 업데이트
  useEffect(() => {
    const container = containerRef.current;
    if (container && isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // 날짜별로 그룹화된 메시지
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        backgroundColor: "#ffffff",
        padding: 2,
        position: "relative",
      }}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {Object.keys(groupedMessages).map((date, dateIndex) => (
        <Box key={dateIndex} sx={{ marginBottom: 2 }}>
          <Typography variant="caption" sx={{ color: "#888", textAlign: "center", marginBottom: 1 }}>
            {date}
          </Typography>
          {groupedMessages[date].map((msg, index) => (
            <Grid container key={msg._id || index} sx={{ marginBottom: 1 }} justifyContent={msg.sender === userId ? "flex-end" : "flex-start"} alignItems="flex-start">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  position: "relative",
                }}
              >
                {/* 사용자 이름을 메시지 위에 배치 */}
                {msg.sender !== userId && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      color: "#888",
                      marginBottom: "4px",
                    }}
                  >
                    {userNames[msg.sender] || "Unknown"}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                    flexDirection: "row",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1, // 채팅 내용이 가능한 한 많은 공간을 차지하도록 설정
                      backgroundColor: msg.sender === userId ? "#03e3c5" : "#e1e1e1",
                      color: msg.sender === userId ? "#ffffff" : "#000000",
                      borderRadius: "16px",
                      padding: "6px 12px",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {msg.content}
                    </Typography>
                    {msg.images && (
                      <Grid container spacing={1} sx={{ marginTop: 1 }}>
                        {msg.images.map((image, i) => (
                          <Grid item xs={3} key={i}>
                            <img
                              src={image.thumbnail}
                              alt={`image-${i}`}
                              onClick={() => handleImageClick(image.original)}
                              style={{
                                width: "100%",
                                cursor: "pointer",
                                borderRadius: "8px",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>

                  {/* 시간 표시를 채팅 내용과 다른 공간에 배치 */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      marginLeft: "8px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: "#aaaaaa",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Box>
      ))}

      {/* 이미지 모달 */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: "80vw",
            height: "80vh",
            backgroundColor: "#fff",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={currentImage} alt="Full size" style={{ maxWidth: "90%", maxHeight: "90%", cursor: "default" }} onClick={(e) => e.stopPropagation()} />
        </Box>
      </Modal>
    </Box>
  );
};

export default MessageList;
