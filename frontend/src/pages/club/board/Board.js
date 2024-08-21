import React, { useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CKEditor5Editor from '../../../components/club/ClubBoardEditor';
import VoteCreationForm from '../../../components/club/ClubVote';
import ListPosts from './BoardList';
import Read from './BoardRead';
import axios from 'axios';


const Board = () => {
  const [open, setOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [postId, setPostId] = useState('');
  const [showPost, setShowPost] = useState(false);
  const [showList, setShowList] = useState(true);
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');

  // 투표 관련 상태
  const [options, setOptions] = useState(['']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [endTime, setEndTime] = useState('');

  // 게시물 저장 함수
  const handleSave = async () => {
    if (!title || !category || !editorData) {
      alert('제목, 카테고리, 내용 모두 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/clubs/boards/posts', {
        title,
        category,
        content: editorData
      });
      console.log('Post saved:', response.data);
      handleClose(); // 모달 닫기
      resetEditorState(); // 상태 리셋
      setShowList(true); // 게시물 리스트 다시 표시
    } catch (error) {
      console.error('Error saving content:', error.response ? error.response.data : error.message);
    }
  }; 

  // 투표 저장 함수
  const handleVoteSave = async () => {
    if (!title || !category || options.length === 0 || !endTime) {
      alert('제목, 카테고리, 옵션, 종료 시간 모두 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/clubs/boards/votes', {
        title,
        options,
        allowMultiple,
        anonymous,
        endTime
      });
      console.log('Vote saved:', response.data);
      handleClose(); // 모달 닫기
      resetVoteState(); // 상태 리셋
      setShowList(true); // 게시물 리스트 다시 표시
    } catch (error) {
      if (error.response) {
        // 서버가 상태 코드로 응답했을 때
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        console.error('Error request data:', error.request);
    } else {
        // 요청을 설정하는 중 발생한 오류
        console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    }
  };

  // 에디터 내용 변경 처리
  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  // 모달 열기
  const handleClickOpen = () => {
    setOpen(true);
    setShowList(false);
  };

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setShowList(true);
    if (category === '투표') {
      resetVoteState(); // 투표 폼 상태 초기화
    } else {
      resetEditorState(); // 에디터 상태 초기화
    }
  };

  // 포스트 선택 처리
  const handleFetchPost = () => {
    setShowPost(true);
  };

  // 포스트 선택 처리
  const handlePostSelect = (id) => {
    setPostId(id);
    setShowPost(true);
  };

  //에디터 상태 리셋
  const resetEditorState = () => {
    setTitle('');
    setCategory('');
    setEditorData('');
    setImage('');
  };

  //투표 상태 리셋
  const resetVoteState = () => {
    setTitle('');
    setCategory('');
    setOptions(['']);
    setAllowMultiple(false);
    setAnonymous(false);
    setEndTime('');
  };


  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        CKEditor 5 Example
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        글쓰기
      </Button>

      {showList && (
        <ListPosts onPostSelect={handlePostSelect} />
      )}

      {showPost && postId && (
        <Read postId={postId} />
      )}

      {/* 모달 컴포넌트 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>글쓰기</DialogTitle>
        <DialogContent>
          {category === '투표' ? (
            <VoteCreationForm
              title={title}
              setTitle={setTitle}
              category={category}
              setCategory={setCategory}
              options={options}
              setOptions={setOptions}
              allowMultiple={allowMultiple}
              setAllowMultiple={setAllowMultiple}
              anonymous={ anonymous}
              setAnonymous={setAnonymous}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          ) : (
            <CKEditor5Editor
              onChange={handleEditorChange}
              title={title}
              setTitle={setTitle}
              category={category}
              setCategory={setCategory}
              content={content}
              setImage={setImage}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
          {category === '투표' ? (
            <Button onClick={handleVoteSave} color="primary">
              저장
            </Button>
          ) : (
            <Button onClick={handleSave} color="primary">
              저장
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Board;
