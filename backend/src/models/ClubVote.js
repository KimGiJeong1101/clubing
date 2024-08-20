// models/Vote.js
const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../util/sequence'); 

const voteSchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  options: [{ type: String, required: true }],
  allowMultiple: { type: Boolean, default: false },
  anonymous: { type: Boolean, default: false },
  endTime: { type: Date, required: true },
  votes: [{ option: String, count: { type: Number, default: 0 } }] // 새로운 필드 추가
});

// save 훅을 사용하여 _id를 자동으로 증가시키기
voteSchema.pre('save', async function (next) {
  if (this.isNew) {
    this._id = await getNextSequenceValue('boardId');
  }
  next();
});

module.exports = mongoose.model('Vote', voteSchema);
