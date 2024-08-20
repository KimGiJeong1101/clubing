const express = require('express');
const router = express.Router();
const Board = require('../models/ClubBoard'); // 모델 경로를 조정하세요
const Vote = require('../models/ClubVote'); // 모델 경로를 조정하세요
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mime = require('mime-types');
const { v4: uuid } = require('uuid');

// Upload directory
const uploadDir = path.join(__dirname, '../upload');

function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dateFolder = getFormattedDate();
        const fullPath = path.join(uploadDir, dateFolder);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

// Routes
router.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).json(req.file);
});

router.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

router.post('/posts', async (req, res) => {
    const { title, category, content } = req.body;
    if (!content) {
        return res.status(400).send('Title and Content are required');
    }
    try {
        const newBoard = new Board({ title, category, content });
        await newBoard.save();
        res.status(200).send('Content received and saved');
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).send('Failed to save content');
    }
});

router.get('/posts', async (req, res) => {
    try {
        const posts = await Board.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Failed to fetch posts');
    }
});

router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Board.findById(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Failed to fetch post');
    }
});

router.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, content } = req.body;
    try {
        const post = await Board.findByIdAndUpdate(id, { title, category, content }, { new: true });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Failed to update post');
    }
});

router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Board.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).send('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Failed to delete post');
    }
});

router.get('/all', async (req, res) => {
    try {
        const [posts, votes] = await Promise.all([
            Board.find(),
            Vote.find()
        ]);
        res.status(200).json({ posts, votes });
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).send('Failed to fetch data');
    }
});

router.post('/votes', async (req, res) => {
    const { title, options, allowMultiple, anonymous, endTime } = req.body;
    
    if (!title || !options || options.length === 0 || !endTime) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    try {
        const newVote = new Vote({
            title,
            options,
            allowMultiple,
            anonymous,
            endTime: new Date(endTime), // endTime을 Date 객체로 변환
            votes: options.map(option => ({ option, count: 0 })) // 초기화
        });
        
        await newVote.save();
        res.status(201).json({ message: '투표가 성공적으로 생성되었습니다.' });
    } catch (error) {
        console.error('투표 생성 중 오류가 발생했습니다:', error);
        res.status(500).json({ error: '투표 생성 중 오류가 발생했습니다.' });
    }
});

router.get('/votes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const vote = await Vote.findById(id);
        if (!vote) {
            return res.status(404).send('Vote not found');
        }
        res.status(200).json(vote);
    } catch (error) {
        console.error('Error fetching vote:', error);
        res.status(500).send('Failed to fetch vote');
    }
});

router.get('/votes/:id/summary', async (req, res) => {
    const { id } = req.params;
    try {
        const vote = await Vote.findById(id);
        if (!vote) {
            return res.status(404).send('Vote not found');
        }
        
        // Assuming the vote object contains a field with votes per option
        const summary = vote.options.map(option => ({
            option,
            count: vote.votes.filter(vote => vote.option === option).length
        }));
        
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching vote summary:', error);
        res.status(500).send('Failed to fetch vote summary');
    }
});

router.post('/votes/:id/vote', async (req, res) => {
    const { id } = req.params;
    const { option } = req.body;
  
    try {
      // Find the vote and increment the count for the selected option
      const vote = await Vote.findOne({ _id: id });
      const voteOption = vote.votes.find(v => v.option === option);
  
      if (voteOption) {
        voteOption.count += 1;
      } else {
        vote.votes.push({ option, count: 1 });
      }
  
      await vote.save();
      res.status(200).json({ message: '투표가 업데이트되었습니다.' });
    } catch (error) {
      console.error('투표 업데이트 중 오류가 발생했습니다:', error);
      res.status(500).json({ error: '투표 업데이트 중 오류가 발생했습니다.' });
    }
});

// DELETE /api/votes/:id  ->이건 라우터 쓰는 버전
router.delete('/votes/:id', async (req, res) => {
    try {
      const vote = await Vote.findByIdAndDelete(req.params.id);
      if (!vote) {
        return res.status(404).json({ error: '투표를 찾을 수 없습니다.' });
      }
      res.status(200).json({ message: '투표가 삭제되었습니다.' });
    } catch (error) {
      console.error('투표 삭제 중 오류:', error);
      res.status(500).json({ error: '투표 삭제 중 오류가 발생했습니다.' });
    }
  });
  



module.exports = router;
