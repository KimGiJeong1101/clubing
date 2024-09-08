import React, { useEffect, useState } from "react";
import { Container, Paper } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClubDetailByChatRoomId,
  fetchInitialMessages,
  fetchOlderMessages,
} from "../../store/actions/chatActions";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import axios from "axios";
import ImageModal from "./ImageModal";

const ChatPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const userData = useSelector((state) => state.user.userData.user);
  const userId = userData._id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [socket, setSocket] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  useEffect(() => {
    if (!id) {
      console.error("Chat room ID is not defined");
      return;
    }

    const fetchData = async () => {
      try {
        // 채팅방 세부정보 가져오기
        const actionResult = await dispatch(fetchClubDetailByChatRoomId(id));
        const clubDetail = actionResult.payload;
        setTitle(clubDetail.title);

        // 초기 메시지 가져오기
        const initialMessagesAction = await dispatch(fetchInitialMessages(id));
        // 배열의 복사본을 만들어서 reverse() 적용
        const initialMessages = [...initialMessagesAction.payload].reverse();
        setMessages(initialMessages);
        setSkip(initialMessages.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", { roomId: id });

    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

      fetch(`http://localhost:4000/clubs/chatrooms/${msg._id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(console.error);
    });

    return () => newSocket.close();
  }, [id, userId]);

  const handleScroll = async (event) => {
    const container = event.target;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop === 0 && !loading && hasMore) {
      setLoading(true);
      const currentHeight = scrollHeight;
      try {
        const olderMessagesAction = await dispatch(
          fetchOlderMessages({ roomId: id, skip })
        );
        const olderMessages = olderMessagesAction.payload;
        if (olderMessages.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prevMessages) => [
            ...olderMessages.reverse(),
            ...prevMessages,
          ]);
          setSkip((prevSkip) => prevSkip + olderMessages.length);

          setTimeout(() => {
            container.scrollTop = container.scrollHeight - currentHeight;
          }, 0);
        }
      } catch (error) {
        console.error("Error fetching older messages:", error);
      } finally {
        setLoading(false);
      }
    }

    setIsAtBottom(scrollTop + clientHeight === scrollHeight);
  };

  const handleSendMessage = () => {
    if (socket && (message.trim() || imageFiles.length > 0)) {
      const newMessage = {
        roomId: id,
        senderId: userId,
        content: message.trim(),
        images: imageFiles,
      };

      socket.emit("message", newMessage);
      setMessage("");
      setImageFiles([]);
    } else {
      console.error("메시지 내용이 필요합니다.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:4000/clubs/chatimage/upload",
        formData
      );
      const imageUrls = res.data.urls;

      const newMessage = {
        roomId: id,
        senderId: userId,
        content: "",
        images: imageUrls,
      };

      socket.emit("message", newMessage);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 4,
        paddingBottom: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader title={title} onFileUpload={handleFileUpload} />
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          height: "calc(100% - 100px)",
          display: "flex",
          flexDirection: "column",
          marginBottom: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <MessageList
          messages={messages}
          userId={userId}
          handleScroll={handleScroll}
          isAtBottom={isAtBottom}
          onImageClick={handleImageClick}
        />
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
      </Paper>
      <ImageModal
        open={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImage}
      />
    </Container>
  );
};

export default ChatPage;
