const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  chatRoom: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
    index: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: false, // 내용 필드를 선택적으로 설정
  },
  images: [
    {
      // 이미지 정보 배열
      original: { type: String },
      thumbnail: { type: String },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
