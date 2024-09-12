// 이 파일은 소켓을 이용한 실시간 채팅 기능을 제공합니다.
// 클라이언트는 소켓을 통해 서버에 메시지를 전송하고, 서버는 실시간으로 메시지를 전달합니다.

const Message = require("../models/Message");

module.exports = (io) => {
  console.log("소켓으로 오냐");
  io.on("connection", (socket) => {
    const clientIp = socket.handshake.address;

    console.log("새로운 클라이언트 연결됨:", socket.id);

    console.log(`소켓 ID: ${socket.id}, 클라이언트 IP: ${clientIp}`);
    console.log(`소켓 ID: ${socket.id}, 클라이언트 IP: ${clientIp}`);

    socket.on("joinRoom", ({ clubId }) => {
      socket.join(clubId);
      console.log(`${socket.id}가 방 ${clubId}에 입장했습니다.`);
      console.log(`${socket.id}가 방 ${clubId}에 입장했습니다.`);
      console.log(`${socket.id}가 방 ${clubId}에 입장했습니다.`);
    });

    socket.on("message", async ({ clubId , senderId, content, images }) => {
      console.log("서버에서 수신한 메시지:", { clubId , senderId, content, images });

      if (!content && (!images || images.length === 0)) {
        console.error("메시지 내용 또는 이미지가 필요합니다.");
        return;
      }

      try {
        const newMessage = new Message({
          chatRoom: clubId ,
          sender: senderId,
          content: content || "",
          images: images || [], // images 필드가 없으면 빈 배열로 설정
          timestamp: new Date(),
        });

        await newMessage.save();
        console.log("메시지 저장 성공:", newMessage);

        io.to(clubId ).emit("message", newMessage);
      } catch (error) {
        console.error("메시지를 저장하는 중 오류 발생:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 연결 끊김:", socket.id);
    });
  });
};
