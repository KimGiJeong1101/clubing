import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CKEditor5Editor from '../../../components/club/ClubBoardRead';
import UpdatePost from '../../../components/club/ClubBoardUpdateEditor';
import { usePost } from '../../../hooks/usePost';

const Read = ({ postId, onClose }) => {
  const { data: post, isLoading, error } = usePost(postId);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

   // 상태 업데이트를 명확히 하기 위해 useEffect 사용
   useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setImage(post.image || '');
    } else {
      // 상태 초기화
      setTitle('');
      setCategory('');
      setContent('');
      setImage('');
    }
  }, [post]);

  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/clubs/boards/posts/${postId}`);
      alert('Post deleted successfully');
      onClose(); // Close Read component after delete
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/clubs/boards/posts/${postId}`, {
        title,
        category,
        content,
        image
      });
      alert('Post updated successfully');
      setOpenEditModal(false);
      onClose(); // Close Read component after save
    } catch (error) {
      console.error('Error updating post:', error);
    }
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
