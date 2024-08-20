// models/Board.js
const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../util/sequence'); 

const boardSchema = mongoose.Schema({
    _id: Number, 
    title: String,
    category: String,
    content: String
});

// save 훅을 사용하여 _id를 자동으로 증가시키기
boardSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequenceValue('boardId');
    }
    next();
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
