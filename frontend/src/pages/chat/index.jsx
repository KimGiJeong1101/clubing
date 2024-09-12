import React, { useEffect, useState } from "react";
import { Container, Paper } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClubDetailByClubId, fetchInitialMessages, fetchOlderMessages } from "../../store/actions/chatActions";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import axios from "axios";
import ImageModal from "./ImageModal";
import Cookies from "js-cookie"; // js-cookie 패키지 임포트

const ChatPage = () => {
  console.log("ChatPage 컴포넌트 렌더링됨");

  // useLocation 사용하여 URL 쿼리 파라미터 추출
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clubNumber = searchParams.get("clubNumber");

  console.log("쿼리 파라미터 clubNumber:", clubNumber);

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

  // 클럽 데이터 가져오기
  useEffect(() => {
    console.log("useEffect 호출됨");
    console.log("현재 clubNumber 값:", clubNumber);

    if (!clubNumber) {
      console.error("Club number is not defined");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("fetchData 함수 호출됨");
        console.log("dispatch 호출 전, 클럽 번호:", clubNumber);
        const actionResult = await dispatch(fetchClubDetailByClubId(clubNumber));
        console.log("dispatch 후, 결과:", actionResult);
        const clubDetail = actionResult.payload;

        console.log(clubDetail);

        console.log(clubDetail.title);

        console.log(clubDetail.club.title);

        setTitle(clubDetail.club.title);

        // 초기 메시지 가져오기
        const initialMessagesAction = await dispatch(fetchInitialMessages(clubNumber));
        // 배열의 복사본을 만들어서 reverse() 적용
        const initialMessages = [...initialMessagesAction.payload].reverse();
        setMessages(initialMessages);
        setSkip(initialMessages.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [clubNumber, dispatch]);

  console.log("유즈이펙트전에");

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket"],
      auth: {
        token: Cookies.get("accessToken"),
      },
    });

    setSocket(newSocket);

    // 소켓 연결이 완료되었을 때 실행되는 콜백
    newSocket.on("connect", () => {
      console.log("소켓 연결됨");

      // 방에 입장
      newSocket.emit("joinRoom", { clubId: clubNumber }); // clubId로 통일

      // 메시지를 수신했을 때 실행되는 콜백
      newSocket.on("message", (msg) => {
        // 받은 메시지를 상태에 추가
        setMessages((prevMessages) => [...prevMessages, msg]);

        // `clubNumber` 값을 확인
        console.log("진짜...." + clubNumber);

        // 메시지 읽음 상태 업데이트 요청
        // fetch(`http://localhost:4000/clubs/chatrooms/${clubNumber}/messages`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ userId }),
        // }).catch((error) => {
        //   console.error("메시지 읽음 상태 업데이트 중 오류 발생:", error);
        // });
      });
    });

    // 소켓 클린업
    return () => {
      if (newSocket) {
        newSocket.off("message");
        newSocket.close();
      }
    };
  }, [clubNumber, userId]);

  // 이전 메시지 가져오기 (스크롤 시)
  const handleScroll = async (event) => {
    const container = event.target;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop === 0 && !loading && hasMore) {
      setLoading(true);
      const currentHeight = scrollHeight;
      try {
        const olderMessagesAction = await dispatch(fetchOlderMessages({ clubId: clubNumber, skip }));
        const olderMessages = olderMessagesAction.payload;
        if (olderMessages.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prevMessages) => [...olderMessages.reverse(), ...prevMessages]);
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
    // 변수의 상태 확인
    console.log("소켓 상태:", socket);
    console.log("메시지 내용:", message.trim());
    console.log("이미지 파일:", imageFiles);
    console.log("클럽 번호:", clubNumber);
    console.log("유저 ID:", userId);

    // 메시지 전송 처리
    if (socket && (message.trim() || imageFiles.length > 0)) {
      const newMessage = {
        clubId: clubNumber, // 메시지 전송에 필요한 데이터
        senderId: userId,
        content: message.trim(),
        images: imageFiles,
      };

      // 메시지 전송
      socket.emit("message", newMessage);
      setMessage("");
      setImageFiles([]);
    } else {
      console.error("메시지 내용이 필요합니다.");
    }
  };

  // 엔터 키 입력 처리
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // 이미지 업로드
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post("http://localhost:4000/clubs/chatimage/upload", formData);
      const imageUrls = res.data.urls;

      const newMessage = {
        clubId: clubNumber,
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
        <MessageList messages={messages} userId={userId} handleScroll={handleScroll} isAtBottom={isAtBottom} onImageClick={handleImageClick} />
        <MessageInput message={message} setMessage={setMessage} handleSendMessage={handleSendMessage} handleKeyPress={handleKeyPress} />
      </Paper>
      <ImageModal open={isModalOpen} onClose={handleCloseModal} imageUrl={selectedImage} />
    </Container>
  );
};

export default ChatPage;
