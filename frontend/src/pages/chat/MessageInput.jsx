import React, { useRef, useState } from 'react';
import { Grid, TextField, Button, Box, IconButton, InputAdornment } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from '@emoji-mart/react';

const MessageInput = ({ message, setMessage, handleSendMessage, handleKeyPress }) => {
  const [showPicker, setShowPicker] = useState(false);
  const messageInputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    if (emoji && messageInputRef.current) {
      const start = messageInputRef.current.selectionStart || 0;
      const end = messageInputRef.current.selectionEnd || 0;
      const newMessage = message.slice(0, start) + emoji.native + message.slice(end);
      setMessage(newMessage);

      setTimeout(() => {
        messageInputRef.current.selectionStart = messageInputRef.current.selectionEnd = start + emoji.native.length;
        messageInputRef.current.focus();
      }, 0);

      setShowPicker(false);
    }
  };

  const handleTogglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: 1, backgroundColor: '#e0e0e0', padding: 1.5 }}>
      <Grid item xs={10} sm={11}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          inputRef={messageInputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton color="primary" onClick={handleTogglePicker}>
                  <EmojiEmotionsIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            backgroundColor: '#ffffff', 
            padding: '8px 14px', // padding을 약간 늘려서 입력 필드 크기 조정
            fontSize: '0.9rem' // 글씨 크기 약간 증가
          }}
        />
        {showPicker && (
          <Box sx={{ position: 'absolute', bottom: 60 }}>
            <Picker onEmojiSelect={handleEmojiClick} />
          </Box>
        )}
      </Grid>
      <Grid item xs={2} sm={1}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendMessage}
          sx={{ backgroundColor: '#007bff', padding: '8px 0' }} // padding을 약간 늘려서 버튼 크기 조정
        >
          보내기
        </Button>
      </Grid>
    </Grid>
  );
};

export default MessageInput;
