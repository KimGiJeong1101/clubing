const mongoose = require("mongoose");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const ChatIP = require("../models/ChatIP");
const User = require("../models/User")
// const authenticateSocket = require("../middleware/authenticateSocket");



const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId);

    if (!user) return next(new Error('Authentication error'));

    socket.request.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};




module.exports = (io) => {
  io.use(authenticateSocket);

  io.on("connection", async (socket) => {
    const clientIp = socket.handshake.address;
    console.log("서버에서 설정된 사용자 정보:", socket.request.user);

    console.log("새로운 클라이언트 연결됨:", socket.id);
    console.log(`소켓 ID: ${socket.id}, 클라이언트 IP: ${clientIp}`);

    try {
      await addIPRecord(socket.request.user._id, clientIp);
    } catch (error) {
      console.error("IP 기록을 저장하는 중 오류 발생:", error);
    }

    socket.on("joinRoom", ({ clubId }) => {
      socket.join(clubId);
      console.log(`${socket.id}가 방 ${clubId}에 입장했습니다.`);
    });

    socket.on("message", async ({ clubId, senderId, content, images }) => {
      console.log("서버에서 수신한 메시지:", { clubId, senderId, content, images });

      if (!content && (!images || images.length === 0)) {
        console.error("메시지 내용 또는 이미지가 필요합니다.");
        return;
      }

      try {
        const newMessage = new Message({
          clubId,
          sender: senderId,
          content: content || '',
          images: images || [],
          timestamp: new Date(),
        });

        await newMessage.save();
        console.log("메시지 저장 성공:", newMessage);

        io.to(clubId).emit("message", newMessage);
      } catch (error) {
        console.error("메시지를 저장하는 중 오류 발생:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 연결 끊김:", socket.id);
    });
  });
};

async function addIPRecord(userId, ipAddress) {
  try {
    const now = new Date();
    const chatIP = await ChatIP.findOne({ userId });

    if (chatIP) {
      if (chatIP.ipRecords.length >= 3) {
        chatIP.ipRecords.shift();
      }

      chatIP.ipRecords.push({
        ip: ipAddress,
        timestamp: now,
      });

      await chatIP.save();
    } else {
      const newChatIP = new ChatIP({
        userId,
        ipRecords: [
          {
            ip: ipAddress,
            timestamp: now,
          },
        ],
      });

      await newChatIP.save();
    }

    console.log("IP 기록이 성공적으로 추가되었습니다.");
  } catch (error) {
    console.error("IP 기록을 추가하는 중 오류가 발생했습니다:", error);
  }
}
