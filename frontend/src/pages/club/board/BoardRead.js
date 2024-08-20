import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CKEditor5Editor from '../../../components/club/ClubBoardRead';
import {usePost} from '../../../hooks/usePost'

const Read = ({ postId }) => {
  const { data: post, isLoading, error } = usePost(postId);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${postId}`);
      alert('Post deleted successfully');
      // Redirection or state update to handle post deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:4000/api/posts/${postId}`, {
        title,
        category,
        content
      });
      alert('Post updated successfully');
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleOpenEditModal = () => {
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
              onChange={(data) => setContent(data)}
              readOnly={true}
            />
          </div>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleOpenEditModal} style={{ marginRight: '8px' }}>
              수정
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        </>
      )}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="md">
        <DialogTitle>게시물 수정</DialogTitle>
        <DialogContent>
          <CKEditor5Editor
            content={content}
            onChange={(data) => setContent(data)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">
            닫기
          </Button>
          <Button onClick={handleEdit} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Read;
