const mongoose = require('mongoose');

// ChatRoom 스키마
const chatRoomSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.Number,
    ref: 'Club',
    required: true,
    unique: true,
  },
  title: {
    type: String,
    // required 속성 제거 (선택 사항으로 만듦)
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
