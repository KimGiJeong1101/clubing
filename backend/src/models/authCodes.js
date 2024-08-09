const { default: mongoose } = require("mongoose");
const nodemailer = require('nodemailer');

// MongoDB 모델 정의
const authCodeSchema = new mongoose.Schema({
    email: String,
    codeId: String,
    number: Number,
    expires: Date
});

const AuthCode = mongoose.model('AuthCode', authCodeSchema);

module.exports = AuthCode;