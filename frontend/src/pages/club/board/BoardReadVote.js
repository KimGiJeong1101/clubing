import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? '#e3f2fd' : theme.palette.background.paper,
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  boxSizing: 'border-box',
}));

const fetchVote = async (voteId) => {
  try {
  const response = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}`);
  console.log('Fetched vote data:', response.data); // 로그 추가
  return response.data;
  } catch (error) {
  console.error('Error fetching vote data:', error);
  throw error; // 오류를 다시 던져서 useQuery에서 처리할 수 있게 합니다.
}
};

const fetchVoteSummary = async (voteId) => {
  const response = await axios.get(`http://localhost:4000/clubs/boards/votes/${voteId}/summary`);
  return response.data;
};

const ReadVote = ({ voteId, onClose }) => {
  const queryClient = useQueryClient();
  const [summary, setSummary] = useState([]);
  const [openSummary, setOpenSummary] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const email = useSelector(state => state.user?.userData?.user?.email || null);
  console.log('Selected email:', email);

  // 투표 데이터 가져오기
  const { data: vote, isLoading, error } = useQuery({
    queryKey: ['vote', voteId],
    queryFn: () => fetchVote(voteId),
    onSuccess: (data) => {
      console.log('Vote data on success:', data); // 로그 추가
      const userHasVoted = data.votes.some(vote => vote.emails.includes(email));
      setHasVoted(userHasVoted);
      setIsAuthor(data.author === email);

    // email과 data.author 값 출력
    console.log('Current email:', email);
    console.log('Vote author:', data.author);

      if (!userHasVoted) setSelectedOption(null);
    }
  });


console.log('Loading:', isLoading);
console.log('Error:', error);

  // 투표 요약 데이터 가져오기
  const { data: voteSummary, refetch: refetchSummary } = useQuery({
    queryKey: ['voteSummary', voteId],
    queryFn: () => fetchVoteSummary(voteId),
    enabled: false // 명시적으로 호출될 때만 데이터를 가져옵니다
  });

  // 투표 삭제를 위한 Mutation 훅
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`http://localhost:4000/clubs/boards/votes/${voteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vote']);
      queryClient.invalidateQueries(['posts']); // 리스트도 최신화
      onClose(); // 컴포넌트 닫기
    },
    onError: (error) => {
      console.error('투표 삭제 중 오류 발생:', error);
    },
  });

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
        console.error('투표 수 업데이트 중 오류 발생:', error);
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
      await refetchSummary(); // 최신 투표 요약 가져오기
      setOpenSummary(true);
    } catch (error) {
      console.error('투표 요약 가져오기 중 오류 발생:', error);
    }
  };

  const handleSummaryClose = () => {
    setOpenSummary(false);
  };

  const handleRemoveVote = async () => {
    if (selectedOption && hasVoted) {
      try {
        await axios.put(`http://localhost:4000/clubs/boards/votes/${voteId}`, { option: selectedOption, email });
        setHasVoted(false);
        setSelectedOption(null);
        await refetchSummary(); // 최신 투표 요약 가져오기
      } catch (error) {
        console.error('투표 취소 중 오류 발생:', error);
      }
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching vote: {error.message}</p>;


  console.log('Vote data:', vote);

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
              {vote.options && vote.options.length > 0 ? (
                vote.options.map((option, index) => {
                  const count = summary.find(item => item.option === option)?.count || 0;
                  return (
                    <StyledListItem
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      selected={selectedOption === option}
                    >
                      <ListItemText primary={option} />
                      <ListItemText secondary={`선택 수: ${count}`} />
                    </StyledListItem>
                  );
                })
              ) : (
                <ListItem>
                  <ListItemText primary="No options available" />
                </ListItem>
              )}
            </List>
            <Box my={2}>
              {!hasVoted ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVote}
                  disabled={!selectedOption}
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
              {isAuthor && (
                <Button variant="contained" color="error" onClick={handleDelete} mr={2}>
                  투표 삭제
                </Button>
              )}
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
          <Dialog open={openSummary} onClose={handleSummaryClose} fullWidth maxWidth="md">
            <DialogTitle>투표 결과</DialogTitle>
            <DialogContent>
              <List>
                {voteSummary && voteSummary.length > 0 ? (
                  voteSummary.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item.option} />
                      <ListItemText secondary={`선택 수: ${item.count}`} />
                      <ListItemText secondary={`투표한 사람: ${item.emails.join(', ')}`} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No summary available" />
                  </ListItem>
                )}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSummaryClose} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default ReadVote;
