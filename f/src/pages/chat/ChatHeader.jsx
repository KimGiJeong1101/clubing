import React from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ChatHeader = ({ title, onFileUpload }) => {


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (onFileUpload) {
      onFileUpload(files); // 파일 업로드 핸들러 호출
    }
  };


  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2, backgroundColor: '#f0f0f0', padding: 2 }}>
      <Grid item>
        <Typography variant="h3" sx={{ textAlign: "left" }}>
          {title ? `${title} 채팅방` : '채팅방'}
        </Typography>
      </Grid>
      <Grid item>
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        id="file-upload" 
      />
        <label htmlFor="file-upload">
        <IconButton color="primary" aria-label="add" component="span">
          <AddIcon />
        </IconButton>
      </label>
      </Grid>
    </Grid>
  );
};

export default ChatHeader;
