// 이 파일은 채팅방을 관리하는 REST API를 제공합니다.
// 클라이언트는 HTTP 요청을 통해 채팅방을 생성하거나 조회할 수 있습니다.

const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/ChatRoom"); // ChatRoom 모델 불러오기
const Club = require("../models/Club"); // Club 모델 불러오기
const Message = require("../models/Message"); // Message 모델 불러오기
const User = require("../models/User"); // User 모델 불러오기
const mongoose = require("mongoose");
const ReadBy = require("../models/ReadBy"); // ReadBy 모델 불러오기




// 사용자 ID로 사용자 정보를 가져오는 함수
const getUserById = async (id) => {
  try {
    // 몽구스는 ID를 _id로 사용할 수도 있지만, findById 메서드를 사용해 사용자 검색 가능
    return await User.findById(id); // User 모델을 사용하여 주어진 ID로 사용자 검색
  } catch (error) {
    console.error("Error fetching user:", error); // 오류 발생 시 콘솔에 로그 출력
    throw new Error("Error fetching user"); // 오류를 던져 호출한 곳에서 처리하도록 함
  }
};


router.post("/room", async (req, res) => {
  try {
    const { clubId, participants } = req.body;

    console.log("Received request body:", req.body); // 전체 요청 본문 로그 추가
    console.log("Received clubId:", clubId);
    console.log("Received participants:", participants);

    // clubId가 제공되지 않았을 경우
    if (!clubId) {
      return res.status(400).json({ message: "clubId는 필수 항목입니다." });
    }

    // clubId에 해당하는 모임이 존재하는지 확인
    const clubExists = await Club.findById(clubId);
    if (!clubExists) {
      return res.status(404).json({ message: "해당 모임이 존재하지 않습니다." });
    }

    // participants 배열이 유효한지 확인
    if (!Array.isArray(participants) || participants.length === 0) {
      console.error("Invalid participants array:", participants);
      return res.status(400).json({ message: "참가자 목록이 유효하지 않습니다." });
    }


    // 참가자 ID로 사용자 정보 가져오기
    const participantUsers = await Promise.all(
      participants.map(async (id) => {
        try {
          console.log("Fetching user for ID:", id); // 사용자 정보 요청 ID 로그 추가
          return await getUserById(id);
        } catch (err) {
          console.error("Error fetching user by ID:", id, err);
          return null;
        }
      })
    );


    // 유효한 사용자들만 ObjectId로 변환
    const participantObjectIds = participantUsers
      .filter((user) => user) // null인 값을 필터링
      .map((user) => new mongoose.Types.ObjectId(user._id));

    console.log("Participant Object IDs:", participantObjectIds);

    // clubId로 이미 존재하는 채팅방을 찾음
    let chatRoom = await ChatRoom.findOne({ clubId });
    if (chatRoom) {
      console.log("Existing chat room found:", chatRoom); // 기존 채팅방 로그 추가

      const existingParticipants = chatRoom.participants.map((participant) =>
        participant.toString()
      );

      // 중복을 제거하고 기존 참가자 목록에 새로운 참가자들을 추가
      const updatedParticipants = [
        ...new Set([
          ...existingParticipants,
          ...participantObjectIds.map((id) => id.toString()), // 새로운 참가자 목록을 문자열로 변환 후 추가
        ]),
      ];

      chatRoom.participants = updatedParticipants.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      // 업데이트된 채팅방 저장
      const updatedChatRoom = await chatRoom.save(); // 업데이트된 채팅방 저장
      console.log("Updated chatRoom:", updatedChatRoom);
      return res.status(200).json(updatedChatRoom); // 업데이트된 채팅방 정보 반환
    }

    // 새로운 채팅방 생성
    const newChatRoom = new ChatRoom({
      clubId,
      participants: participantObjectIds,
    });

    const savedChatRoom = await newChatRoom.save();
    console.log("Newly saved chatRoom:", savedChatRoom);
    res.status(201).json(savedChatRoom);
  } catch (error) {
    console.error("Error creating or updating chat room:", error);
    res.status(500).json({ message: "채팅방 생성에 실패했습니다." });
  }
});








router.get("/room/:id", async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    console.log("Fetching chat room with ID:", chatRoomId);
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      console.log("Chat room not found");
      return res.status(404).json({ message: "채팅방을 찾을 수 없습니다." });
    }

    console.log("Chat room found:", chatRoom);
    const club = await Club.findById(chatRoom.clubId);

    if (!club) {
      console.log("Club not found with ID:", chatRoom.clubId);
      return res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }

    console.log("Club found:", club);
    res.status(200).json(club);
  } catch (error) {
    console.error("Error fetching club by chat room ID:", error);
    res.status(500).json({ message: "모임 세부 정보를 가져오는 중 오류가 발생했습니다." });
  }
});


// 채팅방의 메시지를 페이지네이션 처리하여 가져오는 API
router.get("/:id/messages", async (req, res) => {
  const { id } = req.params; // 채팅방 ID 추출
  const { skip = 0, limit = 30 } = req.query; // 페이지네이션 파라미터 추출
  try {
    const messages = await Message.find({ chatRoom: id }) // 채팅방 ID로 메시지 조회
      .sort({ timestamp: -1 }) // 최신 메시지부터 정렬
      .skip(parseInt(skip)) // skip 적용 (해당 페이지의 시작점 느낌)
      .limit(parseInt(limit)); // limit 적용 (해당 페이지의 데이터 개수)
    res.json(messages); // 메시지 배열을 클라이언트에 반환
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" }); // 서버 오류 발생 시 응답
  }
});



// router.post('/:messageId/read', async (req, res) => {
//   const { messageId } = req.params;
//   const { userId } = req.body;

//   console.log("POST request received. Message ID:", messageId, "User ID:", userId);

//   try {
//     // 메시지가 존재하는지 확인
//     const message = await Message.findById(messageId);
//     if (!message) {
//       console.log("Message not found for ID:", messageId);
//       return res.status(404).json({ message: '메시지가 존재하지 않습니다.' });
//     }

//     let readBy = await ReadBy.findOne({ messageId });

//     if (readBy) {
//       console.log("ReadBy document found:", readBy);
//       const userIndex = readBy.users.findIndex(user => user.userId.toString() === userId);
//       if (userIndex === -1) {
//         console.log("User not found in readBy.users, adding new user.");
//         readBy.users.push({ userId, readAt: new Date() });
//         await readBy.save();
//       } else {
//         console.log("User found in readBy.users, updating readAt.");
//         readBy.users[userIndex].readAt = new Date();
//         await readBy.save();
//       }
//     } else {
//       console.log("No ReadBy document found, creating new one.");
//       readBy = new ReadBy({
//         messageId,
//         users: [{ userId, readAt: new Date() }]
//       });
//       await readBy.save();
//     }

//     res.status(200).json({ message: '읽음 상태가 업데이트되었습니다.' });
//   } catch (error) {
//     console.error("Error in POST /:messageId/read:", error);
//     res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//   }
// });


// router.get('/chatrooms/messages/:messageId/read', async (req, res) => {
//   const { messageId } = req.params;

//   console.log("GET request received for message ID:", messageId);

//   try {
//     // 메시지가 존재하는지 확인
//     const message = await Message.findById(messageId);
//     if (!message) {
//       console.log("Message not found for ID:", messageId);
//       return res.status(404).json({ message: '메시지가 존재하지 않습니다.' });
//     }

//     const readBy = await ReadBy.findOne({ messageId });
//     if (readBy) {
//       console.log("ReadBy document found:", readBy);
//       res.status(200).json({ readBy: readBy.users });
//     } else {
//       console.log("No readBy document found for message ID:", messageId);
//       res.status(404).json({ message: '읽음 기록이 없습니다.' });
//     }
//   } catch (error) {
//     console.error("Error in GET /chatrooms/messages/:messageId/read:", error);
//     res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//   }
// });




module.exports = router;
