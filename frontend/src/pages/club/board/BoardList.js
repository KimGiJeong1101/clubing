import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Read from './BoardRead';
import ReadVote from './BoardReadVote';
import { useLocation } from 'react-router-dom';

// API에서 게시물을 가져오는 함수
const fetchPosts = async (clubNumber) => {
  const response = await axios.get(`http://localhost:4000/clubs/boards/all?clubNumber=${clubNumber}`);
  return response.data;
};

const ListPosts = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  // react-query의 useQuery 훅을 사용하여 데이터 가져오기
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['posts', clubNumber], // 쿼리 키를 객체 형태로 제공
    queryFn: () => fetchPosts(clubNumber),
    keepPreviousData: true, // 새 데이터 가져오는 동안 이전 데이터 유지
  });

  const handleSelect = (id, category) => {
    if (selectedItemId === id) {
      setSelectedItemId(null);
      setSelectedItemCategory('');
    } else {
      setSelectedItemId(id);
      setSelectedItemCategory(category);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        게시물 및 투표 목록
      </Typography>
      <Typography variant="h6" component="h2">
        이 위치에 카테고리 선택하는 거 출력
      </Typography>
      <List>
        {items.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem
              button
              onClick={() => handleSelect(item._id, item.options && item.options.length > 0 ? '투표' : '게시물')}
            >
              <ListItemText
                primary={item.title}
                secondary={`Category: ${item.category || '투표'} ${item.endTime ? `End Time: ${new Date(item.endTime).toLocaleString()}` : ''}`}
              />
            </ListItem>
            {selectedItemId === item._id && (
              <Box sx={{ padding: 2 }}>
                {selectedItemCategory === '투표' && <ReadVote voteId={selectedItemId} />}
                {selectedItemCategory === '게시물' && <Read postId={selectedItemId} onClose={() => handleSelect(null, '')} />}
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default ListPosts;
