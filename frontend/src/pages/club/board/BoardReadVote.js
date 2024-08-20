import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, FormGroup, FormControlLabel, Checkbox, Typography, TextField, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, styled } from '@mui/material';

const StyledListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  boxSizing: 'border-box',
}));

const ReadVote = ({ voteId, options, setOptions }) => {
  const [vote, setVote] = useState(null);
  const [summary, setSummary] = useState([]);
  const [openSummary, setOpenSummary] = useState(false);

  useEffect(() => {
    const fetchVote = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/votes/${voteId}`);
        setVote(response.data);
        const summaryResponse = await axios.get(`http://localhost:4000/api/votes/${voteId}/summary`);
        setSummary(summaryResponse.data);
      } catch (error) {
        console.error('Error fetching vote:', error);
      }
    };

    fetchVote();
  }, [voteId]);

  const handleSummaryOpen = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/votes/${voteId}/summary`);
      setSummary(response.data);
      setOpenSummary(true);
    } catch (error) {
      console.error('Error fetching vote summary:', error);
    }
  };

  const handleSummaryClose = () => {
    setOpenSummary(false);
  };

  const handleOptionClick = async (option) => {
    try {
      await axios.post(`http://localhost:4000/api/votes/${voteId}/vote`, { option });
      const updatedSummary = summary.map(item => 
        item.option === option ? { ...item, count: item.count + 1 } : item
      );
      setSummary(updatedSummary);
    } catch (error) {
      console.error('Error updating vote count:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/votes/${voteId}`);
      alert('투표가 삭제되었습니다.');
      // 삭제 후 리디렉션 또는 상태 업데이트 필요
      // 예: window.location.href = '/votes';
    } catch (error) {
      console.error('Error deleting vote:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        투표 내용
      </Typography>
      {vote && (
        <>
          <Box sx={{ padding: 2 }}>
            <TextField
              label="투표 제목"
              variant="outlined"
              fullWidth
              margin="normal"
              value={vote.title}
              readOnly
            />
            <List>
              {vote.options.map((option, index) => (
                <StyledListItem key={index} onClick={() => handleOptionClick(option)}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {option}
                  </Typography>
                  <Typography variant="body2">
                    {summary.find(item => item.option === option)?.count || 0}
                  </Typography>
                </StyledListItem>
              ))}
            </List>
            <Box my={2}>
               <Button variant="contained" color="primary" onClick={handleSummaryOpen} style={{ marginRight: '8px' }}>
                투표 결과 보기
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                투표 삭제
              </Button>
            </Box>
           
            <TextField
              label="투표 종료 시간"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              value={new Date(vote.endTime).toISOString().slice(0, 16)} // 날짜 형식 조정
              readOnly
            />
          </Box>
        </>
      )}
      <Dialog open={openSummary} onClose={handleSummaryClose} fullWidth maxWidth="md">
        <DialogTitle>투표 결과</DialogTitle>
        <DialogContent>
          <List>
            {summary.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item.option} secondary={`선택 수: ${item.count}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSummaryClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReadVote;
