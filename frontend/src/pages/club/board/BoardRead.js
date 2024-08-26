import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CKEditor5Editor from '../../../components/club/ClubBoardRead';
import UpdatePost from '../../../components/club/ClubBoardUpdateEditor';
import { usePost } from '../../../hooks/usePost';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Read = ({ postId, onClose }) => {
  const queryClient = useQueryClient();
  const { data: post, isLoading, error } = usePost(postId);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);

  const author = useSelector(state => state.user?.userData?.user?.email || null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setImage(post.image || '');
      setIsAuthor(post.author === author);
    } else {
      setTitle('');
      setCategory('');
      setContent('');
      setImage('');
      setIsAuthor(false);
    }
  }, [post, author]);

  // 게시물 삭제를 위한 Mutation 훅
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`http://localhost:4000/clubs/boards/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']); // 게시물 목록 쿼리 키로 무효화
      onClose(); // 삭제 후 컴포넌트 닫기
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
  });

  // 게시물 수정을 위한 Mutation 훅
  const updateMutation = useMutation({
    mutationFn: () => axios.put(`http://localhost:4000/clubs/boards/posts/${postId}`, {
      title,
      category,
      content,
      image
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']); // 게시물 목록 쿼리 키로 무효화
      setOpenEditModal(false);
      onClose(); // 수정 후 컴포넌트 닫기
    },
    onError: (error) => {
      console.error('Error updating post:', error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleSave = () => {
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

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching post: {error.message}</p>;
  if (!post) return <p>No post found</p>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        게시글 내용
      </Typography>
      {post && (
        <>
          <Typography variant="h5" component="h2" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Category: {post.category}
          </Typography>
          <div className="fetched-content">
            <CKEditor5Editor
              content={post.content}
              readOnly={true}
            />
          </div>
          {isAuthor && (
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleOpenEditModal} style={{ marginRight: '8px' }}>
                수정
              </Button>
              <Button variant="contained" color="secondary" onClick={handleDelete}>
                삭제
              </Button>
            </Box>
          )}
        </>
      )}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="md">
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
    </Container>
  );
};

export default Read;
