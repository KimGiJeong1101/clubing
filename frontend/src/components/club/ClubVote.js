// VoteCreationForm.js
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel, Button, FormGroup, Box } from '@mui/material';
import axios from 'axios';

const VoteCreationForm = ({options,setOptions,allowMultiple,setAllowMultiple,anonymous,setAnonymous,endTime,setEndTime,title, setTitle,category, setCategory}) => {
  const categories = ['자유글', '관심사공유', '모임후기', '가입인사','공지사항(전체알림)','투표']; // 카테고리 옵션
  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

 // 오늘 날짜와 시간을 'yyyy-MM-ddTHH:mm' 형식으로 변환하는 함수
 const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

   // 오늘 날짜와 시간으로부터 하루 뒤를 'yyyy-MM-ddTHH:mm' 형식으로 변환하는 함수
   const getTomorrowDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // 하루 추가
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 기본값을 설정하는 useEffect
  useEffect(() => {
    if (!endTime) {
      setEndTime(getTomorrowDateTime());
    }
  }, [endTime, setEndTime]);

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="투표 제목"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Category"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {options.map((option, index) => (
        <TextField
          key={index}
          label={`투표 항목 ${index + 1}`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <Button variant="contained" color="primary" onClick={addOption}>항목 추가</Button>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
            />
          }
          label="복수 선택 허용"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
          }
          label="익명 투표"
        />
      </FormGroup>
      <TextField
        label="투표 종료 시간"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        inputProps={{ min: getTodayDateTime() }} // 오늘 날짜와 시간 이후로만 선택 가능
      />
    </Box>
  );
};

export default VoteCreationForm;
