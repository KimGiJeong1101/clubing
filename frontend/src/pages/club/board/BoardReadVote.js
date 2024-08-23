import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, TextField, List, ListItem, ListItemText, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, styled } from '@mui/material';

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? '#e3f2fd' : theme.palette.background.paper, // 아주 옅은 하늘색
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  boxSizing: 'border-box',
}));

const ReadVote = ({ voteId }) => {
  const [vote, setVote] = useState(null);
  const [summary, setSummary] = useState([]);
  const [openSummary, setOpenSummary] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const email = useSelector(state => state.user?.userData?.user?.email || null);

  useEffect(() => {
    const fetchVote = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}`);
        setVote(response.data);
        const summaryResponse = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}/summary`);
        setSummary(summaryResponse.data);
        const userHasVoted = response.data.votes.some(vote => vote.emails.includes(email));
        setHasVoted(userHasVoted);
        if (!userHasVoted) setSelectedOption(null);
      } catch (error) {
        console.error('Error fetching vote:', error);
      }
    };

    fetchVote();
  }, [voteId, email]);

  const handleVote = async () => {
    if (selectedOption && !hasVoted) {
      try {
        await axios.post(`http://localhost:4000/clubs/boards/votes/${voteId}/vote`, { option: selectedOption, email });
        setHasVoted(true);
        const updatedSummary = summary.map(item =>
          item.option === selectedOption ? { ...item, count: item.count + 1 } : item
        );
        setSummary(updatedSummary);
      } catch (error) {
        console.error('Error updating vote count:', error);
      }
    }
  };

  const handleOptionClick = (option) => {
    if (!hasVoted) {
      setSelectedOption(option);
    }
  };

  const handleSummaryOpen = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}/summary`);
      setSummary(response.data);
      setOpenSummary(true);
    } catch (error) {
      console.error('Error fetching vote summary:', error);
    }
  };

  const handleSummaryClose = () => {
    setOpenSummary(false);
  };

  const handleRemoveVote = async () => {
    if (selectedOption && hasVoted) {
      try {
        // 서버에 PUT 요청 보내기
        await axios.put(`http://localhost:4000/clubs/boards/votes/${voteId}`, {
          option: selectedOption,
          email
        });
  
        // 클라이언트 상태 업데이트
        setHasVoted(false);
        setSelectedOption(null);
  
        // 최신 투표 요약을 다시 가져오기
        const updatedSummaryResponse = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}/summary`);
        setSummary(updatedSummaryResponse.data);
      } catch (error) {
        console.error('투표 취소 중 오류 발생:', error);
      }
    }
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/clubs/boards/votes/${voteId}`);
      alert('투표가 삭제되었습니다.');
      // 삭제 후 리디렉션 또는 상태 업데이트 필요
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
              {vote.options.map((option, index) => {
                // Get the count for the option
                const count = summary.find(item => item.option === option)?.count || 0;
                return (
                  <StyledListItem
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    selected={selectedOption === option}
                  >
                    <ListItemText primary={option}/>
                    <ListItemText secondary={`선택 수: ${count}`}/>
                  </StyledListItem>
                );
              })}
            </List>
            <Box my={2}>
              {!hasVoted ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVote}
                  disabled={!selectedOption} // 선택된 항목이 없으면 비활성화
                  mr={2}
                >
                  투표하기
                </Button>
              ) : (
                <>
                  <Button variant="contained" color="primary" onClick={handleRemoveVote} mr={2}>
                    투표 취소하기
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSummaryOpen} mr={2}>
                    투표 결과 보기
                  </Button>
                </>
              )}
              <Button variant="contained" color="error" onClick={handleDelete} mr={2}>
                투표 삭제
              </Button>
            </Box>
            <TextField
              label="투표 종료 시간"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              value={new Date(vote.endTime).toISOString().slice(0, 16)}
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
                <ListItemText primary={item.option} />
                <ListItemText secondary={`선택 수: ${item.count}`} />
                <ListItemText secondary={`투표한 사람: ${item.emails}`} />
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