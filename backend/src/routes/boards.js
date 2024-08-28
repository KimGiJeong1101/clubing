const express = require('express');
const router = express.Router();
const Board = require('../models/ClubBoard'); 
const Club = require('../models/Club'); 
const fs = require('fs'); 
const path = require('path');
const multer = require('multer');
const mime = require('mime-types');
const { v4: uuid } = require('uuid');

// Upload directory
const uploadDir = path.join(__dirname, '../../upload');

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
    const { clubNumber, create_at,author,title, category, content } = req.body;
    
    // 클럽 확인
    const club = await Club.findById(clubNumber);
    if (!club) {
      return res.status(404).json({ error: '클럽을 찾을 수 없습니다.' });
    }

    // 멤버 확인
    if (!club.members.includes(author)) {
      return res.status(403).json({ error: '이 클럽의 멤버가 아닙니다.' });
    }
    
    if (!content) {
        return res.status(400).send('Title and Content are required');
    }
    try {
        const newBoard = new Board({ clubNumber, create_at,author,title, category, content });
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
  const { clubNumber } = req.query;
  try {
      const boards = await Board.find({ clubNumber });
      res.status(200).json(boards);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Failed to fetch data');
  }
});

router.post('/votes', async (req, res) => {
    const {clubNumber, create_at,author,title, category, options, allowMultiple, anonymous, endTime } = req.body;
    
     // 클럽 확인
     const club = await Club.findById(clubNumber);
     if (!club) {
       return res.status(404).json({ error: '클럽을 찾을 수 없습니다.' });
     }
 
     // 멤버 확인
     if (!club.members.includes(author)) {
       return res.status(403).json({ error: '이 클럽의 멤버가 아닙니다.' });
     }

    if (!title || !options || options.length === 0 || !endTime) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    try {
        const newBoard = new Board({
            clubNumber, 
            create_at,author,
            title, 
            category,
            options,
            allowMultiple,
            anonymous,
            endTime: new Date(endTime), // endTime을 Date 객체로 변환
            votes: options.map(option => ({ option, count: 0 })) // 초기화
        });
        
        await newBoard.save();
        res.status(201).json({ message: '투표가 성공적으로 생성되었습니다.' });
    } catch (error) {
        console.error('투표 생성 중 오류가 발생했습니다:', error);
        res.status(500).json({ error: '투표 생성 중 오류가 발생했습니다.' });
    }
});

router.get('/votes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).send('Vote not found');
        }
        res.status(200).json(board);
    } catch (error) {
        console.error('Error fetching vote:', error);
        res.status(500).send('Failed to fetch vote');
    }
});

router.get('/votes/:id/summary', async (req, res) => {
    const { id } = req.params;
    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).send('Vote not found');
        }
        
        // Summarize votes and nicknames for each option
        const summary = board.votes.map(vote => ({
            option: vote.option,
            count: vote.count,
            emails: vote.emails// 회원 아이디 배열
        }));
        
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching vote summary:', error);
        res.status(500).send('Failed to fetch vote summary');
    }
});



// 이 부분 수정 필요
router.post('/votes/:id/vote', async (req, res) => {
    const { id } = req.params;
    const { option, email } = req.body;
  
    try {
      const board = await Board.findById(id);
      if (!board) {
        return res.status(404).json({ error: 'Vote not found' });
      }
  
      const userHasVoted = board.votes.some(vote => vote.emails.includes(email));
      if (userHasVoted) {
        return res.status(400).json({ error: 'You have already voted' });
      }
  
      if (board.allowMultiple) {
        let voteOption = board.votes.find(v => v.option === option);
        if (voteOption) {
          voteOption.count += 1;
          voteOption.emails.push(email);
        } else {
          board.votes.push({ option, count: 1, emails: [email] });
        }
      } else {
        board.votes.forEach(v => {
          if (v.emails.includes(email)) {
            v.count -= 1;
            v.emails = v.emails.filter(e => e !== email);
          }
        });
  
        let voteOption = board.votes.find(v => v.option === option);
        if (voteOption) {
          voteOption.count += 1;
          voteOption.emails.push(email);
        } else {
          board.votes.push({ option, count: 1, emails: [email] });
        }
      }
  
      await board.save();
      res.status(200).json({ message: 'Vote has been updated.' });
    } catch (error) {
      console.error('Error updating vote:', error);
      res.status(500).json({ error: 'Failed to update vote.' });
    }
  });
  
  // 이거 투표 한 사람 삭제
  router.put('/votes/:id', async (req, res) => {
    const { id } = req.params;
    const { option, email } = req.body;
  
    try {
      // 투표 ID로 투표 보드 찾기
      const board = await Board.findById(id);
      if (!board) {
        return res.status(404).json({ error: '투표를 찾을 수 없습니다.' });
      }
  
      // 해당 옵션을 찾기
      const voteOption = board.votes.find(v => v.option === option);
      if (voteOption) {
        // 이메일이 포함되어 있는지 확인
        if (voteOption.emails.includes(email)) {
          // 이메일을 제거하고 투표 수 감소
          voteOption.count -= 1;
          voteOption.emails = voteOption.emails.filter(e => e !== email);
        } else {
          return res.status(400).json({ error: '이 옵션에 대해 투표하지 않았습니다.' });
        }
      } else {
        return res.status(404).json({ error: '옵션을 찾을 수 없습니다.' });
      }
  
      // 변경사항 저장
      await board.save();
      res.status(200).json({ message: '투표가 수정되었습니다.' });
    } catch (error) {
      console.error('투표 수정 중 오류 발생:', error);
      res.status(500).json({ error: '투표 수정에 실패했습니다.' });
    }
  });
  

// DELETE /api/votes/:id  ->이건 라우터 쓰는 버전
router.delete('/votes/:id', async (req, res) => {
    try {
      const board = await Board.findByIdAndDelete(req.params.id);
      if (!board) {
        return res.status(404).json({ error: '투표를 찾을 수 없습니다.' });
      }
      res.status(200).json({ message: '투표가 삭제되었습니다.' });
    } catch (error) {
      console.error('투표 삭제 중 오류:', error);
      res.status(500).json({ error: '투표 삭제 중 오류가 발생했습니다.' });
    }
  });

module.exports = router;
