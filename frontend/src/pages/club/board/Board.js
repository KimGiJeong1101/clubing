import React, { useState } from 'react';
import { Container, Typography,Fab, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import CKEditor5Editor from '../../../components/club/ClubBoardEditor';
import VoteCreationForm from '../../../components/club/ClubVote';
import ListPosts from './BoardList';
import axiosInstance from "./../../../utils/axios";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';


const Board = () => {
  const [open, setOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showPost, setShowPost] = useState(false);
  const [showList, setShowList] = useState(true);
  const [image, setImage] = useState('');

  // 투표 관련 상태
  const [options, setOptions] = useState(['']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [endTime, setEndTime] = useState('');


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");
  const author = useSelector(state => state.user?.userData?.user?.email || null);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!title || !category || !editorData) {
      alert('제목, 카테고리, 내용 모두 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('http://localhost:4000/clubs/boards/posts', { 
        clubNumber , 
        create_at: getCurrentDate(), 
        author, 
        title, 
        category, 
        content: editorData 
      });
      handleClose();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error); // 서버에서 반환한 에러 메시지를 알림으로 표시
      } else {
        alert('서버와의 연결에 문제가 발생했습니다.');
      }
      console.error('Error saving content:', error.message);
    }
  };

  const handleVoteSave = async () => {
    if (!title || !category || options.length === 0 || !endTime) {
      alert('제목, 카테고리, 옵션, 종료 시간 모두 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('http://localhost:4000/clubs/boards/votes', { 
        clubNumber , 
        create_at: getCurrentDate(), 
        author, 
        title, 
        category, 
        options, 
        allowMultiple, 
        anonymous, 
        endTime 
      });
      handleClose();
    } catch (error) {
      console.error('Error saving vote:', error.message);
    }
  };


  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setShowList(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowList(true);
    if (category === '투표') {
      resetVoteState();
    } else {
      resetEditorState();
    }
  };

  const resetEditorState = () => {
    setTitle('');
    setCategory('');
    setEditorData('');
  };

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
      <Fab
        onClick={handleClickOpen}
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
        }}
      >
        <AddIcon />
      </Fab>

      {showList && <ListPosts />}

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
              anonymous={anonymous}
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
