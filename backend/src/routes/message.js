const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom"); // ChatRoom 모델을 import

module.exports = (io) => {
  // 소켓 서버의 연결 이벤트를 처리합니다.
  io.on("connection", (socket) => {
    
    // 클라이언트가 소켓 서버에 연결되면 호출됩니다.
    console.log("소켓핸들쉨");
    console.log(socket.handshake); // 클라이언트의 연결 정보를 출력합니다.
    console.log("소켓핸들쉨");

    // 클라이언트의 IP 주소를 가져옵니다. (보통은 IP를 직접 얻는 것은 어렵고, 소켓 핸들쉐이크 정보를 통해 확인합니다)
    const clientIp = socket.handshake.address;
    console.log("새로운 클라이언트 연결됨:", socket.id); // 소켓의 고유 ID를 출력합니다.
    console.log(`소켓 ID: ${socket.id}, 클라이언트 IP: ${clientIp}`);
    
    console.log(clientIp);
    console.log(clientIp);

    // 클라이언트가 특정 방에 입장할 때 호출되는 이벤트 처리
    // `joinRoom` 이벤트는 클라이언트가 방에 들어가려고 할 때 발생합니다.
    socket.on("joinRoom", ({ clubId }) => {
      // 클라이언트를 특정 방에 추가합니다.
      socket.join(clubId);
      console.log(`${socket.id}가 방 ${clubId}에 입장했습니다.`);
    });

    // 클라이언트가 메시지를 보낼 때 호출되는 이벤트 처리
    // `message` 이벤트는 클라이언트가 메시지를 전송할 때 발생합니다.
    socket.on("message", async ({ clubId, senderId, content, images }) => {
      console.log("서버에서 수신한 메시지:", { clubId, senderId, content, images });
    
      // 메시지 내용이 없고 이미지도 없으면 오류 처리
      if (!content && (!images || images.length === 0)) {
        console.error("메시지 내용 또는 이미지가 필요합니다.");
        return; // 메시지가 유효하지 않으면 함수 종료
      }
    
      try {
        // 새로운 메시지를 생성합니다.
        const newMessage = new Message({
          clubId: clubId,  // 메시지가 속할 방의 ID
          sender: senderId, // 메시지의 발신자 ID
          content: content || "", // 메시지 내용 (없으면 빈 문자열)
          images: images || [], // 메시지에 첨부된 이미지 배열 (없으면 빈 배열)
          timestamp: new Date(), // 메시지 전송 시간
        });
    
        // 메시지를 데이터베이스에 저장합니다.
        await newMessage.save();
        console.log("메시지 저장 성공:", newMessage);
    
        // 메시지를 방에 있는 모든 클라이언트에게 전송합니다.
        io.to(clubId).emit("message", newMessage);
      } catch (error) {
        console.error("메시지를 저장하는 중 오류 발생:", error);
      }
    });

    // 클라이언트가 연결을 끊었을 때 호출되는 이벤트 처리
    socket.on("disconnect", () => {
      console.log("클라이언트 연결 끊김:", socket.id); // 소켓의 고유 ID를 출력합니다.
    });
  });
};



// io.on("connection", (socket) => { ... });:
// 소켓 서버에 새로운 클라이언트가 연결되면 호출됩니다. socket 객체는 연결된 클라이언트와의 통신을 담당합니다.


// socket.handshake:
// 클라이언트의 연결 정보가 담겨 있는 객체입니다. 주로 클라이언트의 IP 주소나 인증 정보 등을 포함합니다.


// socket.join(clubId):
// 클라이언트를 특정 방(clubId)에 추가합니다. 클라이언트가 방에 들어가게 되며, 해당 방에 있는 다른 클라이언트와 메시지를 주고받을 수 있습니다.


// socket.on("eventName", callback):
// 클라이언트가 eventName 이벤트를 발생시킬 때 호출되는 콜백 함수를 정의합니다. 이 콜백 함수는 이벤트가 발생할 때 수행할 작업을 처리합니다.



// io.to(clubId).emit("message", newMessage):
// clubId 방에 있는 모든 클라이언트에게 message 이벤트를 발송합니다. 이 메시지는 newMessage 데이터와 함께 전송됩니다.



// socket.on("disconnect", () => { ... });:
// 클라이언트가 연결을 끊었을 때 호출됩니다. 연결이 끊어진 클라이언트의 소켓 ID를 확인할 수 있습니다.