import React from "react";
import { Box } from "@mui/material";
import MyChatList from "./MyChatList";

const MyChat = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      {/* 콘텐츠 영역 */}
      <Box
        sx={{
          p: 3,
          bgcolor: "#e0e0e0", // 배경 색상
          borderRadius: 2,
          boxShadow: 3,
          transition: "background-color 0.3s ease",
        }}
      >
        <MyChatList /> {/* MyChatList 컴포넌트를 직접 렌더링 */}
      </Box>
    </Box>
  );
};

export default MyChat;
