import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import Read from './BoardRead';
import ReadVote from './BoardReadVote';
import { useLocation } from 'react-router-dom';

const ListPosts = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
          const response = await axios.get(`http://localhost:4000/clubs/boards/all?clubNumber=${clubNumber}`);
          setItems(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

    fetchAllData();
  }, []);

  const handleSelect = (id, category) => {
    if (selectedItemId === id) {
      // 현재 클릭한 게시물이 이미 열려있다면, 닫음
      setSelectedItemId(null);
      setSelectedItemCategory('');
    } else {
      // 새로운 게시물을 클릭하면 열음
      setSelectedItemId(id);
      setSelectedItemCategory(category);
    }
  };

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
