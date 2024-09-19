import React, { useState, useEffect } from 'react';
import { Container, Button, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Typography, Avatar } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import CKEditor5Editor from '../../../components/club/ClubBoardRead';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import UpdatePost from '../../../components/club/ClubBoardUpdateEditor';
import Reply from './Reply'; 
import ShareIcon from '@mui/icons-material/Share';
import PushPinIcon from '@mui/icons-material/PushPin';
import { fetchPost, deletePost, updatePost, pinPost } from '../../../api/ClubBoardApi'; 

const BoardRead = ({ postId, onClose }) => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  // console.log(clubNumber)

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    onSuccess: (data) => {
      console.log('게시물 가져오기 성공:', data);
    },
    onError: (error) => {
      console.error('게시물 가져오기 오류:', error);
    },
  });

  const queryClient = useQueryClient();
  const author = useSelector(state => state.user?.userData?.user?.email || null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setImage(post.image || '');
      setIsAuthor(post.author === author);
      setIsPinned(post.pin);
    }
  }, [post, author]);

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      onClose();
    },
    onError: (error) => {
      console.error('게시물 삭제 오류:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updatePost(postId, { title, category, content, image }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setOpenEditModal(false);
      onClose();
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
    },
  });

  const pinMutation = useMutation({
    mutationFn: ({ pin, clubNumber }) => pinPost(id, { pin, clubNumber }),
    onSuccess: (data) => {
      setIsPinned(data.pin);
      queryClient.invalidateQueries(['post', id]);
    },
    onError: (error) => {
      showSnackbar(error.message, 'error');
    },
  });
  

  const handleDelete = () => deleteMutation.mutate();
  const handleSave = () => {
    if (!title) {
      showSnackbar('제목이 없습니다.', 'error');
      return;
    }
    if (!content) {
      showSnackbar('내용이 없습니다.', 'error');
      return;
    }
    updateMutation.mutate();
  };

  const handleOpenEditModal = () => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setImage(post.image || '');
    }
    setOpenEditModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', options);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleToggleReply = () => setOpenReply(prev => !prev);
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleShare = () => {
    const currentUrl = window.location.href; 
    navigator.clipboard.writeText(currentUrl)
      .then(() => showSnackbar('링크가 복사되었습니다!', 'success'))
      .catch((err) => showSnackbar('링크 복사 실패', 'error'));
  };

  const handlePinToggle = () => {
    // console.log('현재 핀 상태:', isPinned);
    pinMutation.mutate({ pin: !isPinned, clubNumber });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>게시물 가져오기 오류: {error.message}</p>;
  if (!post) return <p>게시물을 찾을 수 없습니다.</p>;

  const postType = 'Board';

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4">{post.title}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mr: 2 }}>{post.category}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Typography variant="body2" sx={{ marginRight: 1 }}>작성자:</Typography>
              <Avatar
                alt="avatar"
                src={post.authorImage || 'https://via.placeholder.com/56'}
                sx={{
                  width: 30,
                  height: 30,
                  border: '2px solid white',
                }}
              />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>{post.authorNickname}</Typography>
            </Box>
            <Typography variant="body2">작성 시간: {formatDate(post.create_at)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShareIcon onClick={handleShare} sx={{ cursor: 'pointer', mr: 2 }} />
            <PushPinIcon 
              onClick={handlePinToggle} 
              sx={{ cursor: 'pointer', color: isPinned ? 'gold' : 'inherit' }} 
            />
          </Box>
        </Box>
        <Divider />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ maxWidth: '1000px', width: '100%' }}>
          <CKEditor5Editor content={post.content} readOnly={true} />
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#DBC7B5', color: '#000', '&:hover': { backgroundColor: '#A67153' } }}
                onClick={handleOpenEditModal}
              >
                수정
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#6E3C21', color: '#fff', '&:hover': { backgroundColor: '#A67153' } }}
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Reply postType={postType} postId={id} />
      </Box>

      <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="lg">
        <DialogTitle>게시물 수정</DialogTitle>
        <DialogContent>
          <UpdatePost
            post={{ title, category, content, image }}
            onChange={(data) => setContent(data)}
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            content={content}
            setImage={setImage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">
            닫기
          </Button>
          <Button onClick={handleSave} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BoardRead;