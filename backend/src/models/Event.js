// models/Board.js
const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../util/sequence'); 

const eventSchema = mongoose.Schema({
    _id: Number, 
    clubNumber: Number, 
    create_at:String, 
    author: String,
    title: String,
    category: String,
    content: { type: String, default: false },
    options: [{ type: String, default: false }],
    allowMultiple: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },
    endTime: { type: Date},
});

// save 훅을 사용하여 _id를 자동으로 증가시키기
boardSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequenceValue('eventId');
    }
    next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Board;
