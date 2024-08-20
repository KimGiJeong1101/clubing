import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import ReadVote from './BoardReadVote'; // Import the new component

const ListPosts = ({ onPostSelect, onVoteSelect }) => {
  const [posts, setPosts] = useState([]);
  const [votes, setVotes] = useState([]);
  const [selectedVoteId, setSelectedVoteId] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/all');
        setPosts(response.data.posts);
        setVotes(response.data.votes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

  const handleVoteSelect = (id) => {
    setSelectedVoteId(id);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        게시물 및 투표 목록
      </Typography>
      <Typography variant="h6" component="h2">
        게시물
      </Typography>
      <List>
        {posts.map(post => (
          <ListItem key={post._id} button onClick={() => onPostSelect(post._id)}>
            <ListItemText primary={post.title} secondary={`Category: ${post.category}`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" component="h2">
        투표
      </Typography>
      <List>
        {votes.map(vote => (
          <ListItem key={vote._id} button onClick={() => handleVoteSelect(vote._id)}>
            <ListItemText primary={vote.title} secondary={`End Time: ${new Date(vote.endTime).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
      {selectedVoteId && <ReadVote voteId={selectedVoteId} />}
    </Container>
  );
};

export default ListPosts;