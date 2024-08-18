const { default: mongoose, Schema } = require('mongoose');

const gallerySchema = new Schema({
    clubNumber: {
        type: String,  // 클럽 번호를 저장할 필드
        required: true // 필수 값으로 설정
    },
    writer: {
        type: String,
        ref: 'User'
    },
    title: {
        type: String,
        maxLength: 40,
        required: true 
    },
    content: {
        type: String,
        maxLength: 2000,
        required: true 
    },
    origin_images: {
        type: Array,
        default: [],
        required: true 
    },
    thumbnail_images: {
        type: Array,
        default: [],
        required: true 
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// `save` 이전에 `updatedAt` 필드를 현재 시간으로 갱신하는 pre 훅
gallerySchema.pre('save', function (next) {
    this.updatedAt = Date.now(); // 저장될 때마다 `updatedAt` 필드를 현재 시간으로 설정
    next();
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
