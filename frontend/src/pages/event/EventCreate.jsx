import React, { useState } from "react";
import EventBoardEditor from "./EventBoardEditor"; // EventBoardEditor 불러오기
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close"; // Close 아이콘 불러오기
import { Box } from "@mui/material"; // Box를 이용해 레이아웃 조정


export default function EventCreate({ onClose }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");

    const handleEditorChange = (data) => {
        setContent(data); // 에디터 내용 변경 시 content 업데이트
    };

    return (
        <Box sx={{ position: "relative", padding: "16px" }}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: "absolute", top: 8, right: 8 }} // 오른쪽 상단에 배치
            >
                <CloseIcon />
            </IconButton>
            <h1>이벤트 게시판 작성</h1>
            <EventBoardEditor
                title={title}
                setTitle={setTitle}
                content={content}
                onChange={handleEditorChange}
                setImage={setImage}
            />
        </Box>
    );
}
