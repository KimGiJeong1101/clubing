import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Box, Button, Dialog, DialogTitle, DialogContent, Pagination } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../../../api/ClubBoardApi';
import Read from './BoardRead';
import ReadVote from './BoardReadVote';

const ListPosts = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // 페이지당 게시물 수

  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get("clubNumber");

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', clubNumber, currentPage],
    queryFn: () => fetchPosts(clubNumber, currentPage, limit),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages); // 상태 업데이트
    }
  }, [data]);

  const items = data?.boards || [];

  const handleSelect = (id, category, title) => {
    setSelectedItemId(id);
    setSelectedItemCategory(category);
    setDialogTitle(title);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItemId(null);
    setSelectedItemCategory('');
    setDialogTitle('');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 화살표 아이콘 클릭 핸들러
  const handleArrowClick = (id, category) => {
    if (category === '투표') {
      navigate(`vote/${id}?clubNumber=${clubNumber}`); // 투표 페이지로 이동
    } else {
      navigate(`read/${id}?clubNumber=${clubNumber}`); // 게시물 페이지로 이동
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 가져오는 중 오류 발생: {error.message}</p>;

  const filteredItems = items.filter(item => 
    selectedCategory === '전체' || item.category === selectedCategory
  );

  return (
    <Container fullWidth maxWidth="md">
      <Box mt={1} sx={{ '& button': { m: 1 } }}>
        {['전체', '공지사항(전체알림)', '자유글', '관심사공유', '모임후기', '가입인사', '투표'].map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleCategoryClick(category)}
            sx={{
              bgcolor: selectedCategory === category ? '#DBC7B5' : 'transparent',
              color: selectedCategory === category ? '#fff' : '#000',
              borderColor: selectedCategory === category ? '#DBC7B5' : '#BDC0C8',
              '&:hover': {
                bgcolor: '#A67153',
                borderColor: '#A67153',
                color: '#fff',
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>
      <List>
        {filteredItems.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem
              button
              onClick={() => handleSelect(item._id, item.category, item.title)} // 모달 열기
              sx={{ borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <ListItemText
                primary={item.title}
                secondary={`${item.category || ' 투표 '} ${item.endTime ? `종료시간: ${new Date(item.endTime).toLocaleString()}` : ''}`}
              />
              <ArrowForwardIcon 
                onClick={() => handleArrowClick(item._id, item.category)} // 페이지 이동
                sx={{ cursor: 'pointer' }} 
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              bgcolor: 'transparent',
              color: '#000',
              borderColor: '#BDC0C8',
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              bgcolor: '#DBC7B5',
              color: '#fff',
            },
            '& .MuiPaginationItem-previousNext': {
              bgcolor: 'transparent',
              color: '#000',
              borderColor: '#BDC0C8',
            }
          }}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>{selectedItemCategory === '투표' ? null : dialogTitle}</DialogTitle>
        <DialogContent>
          {selectedItemCategory === '투표' && <ReadVote voteId={selectedItemId} title={dialogTitle} onDelete={() => handleClose()} />}
          {selectedItemCategory !== '투표' && <Read postId={selectedItemId} title={dialogTitle} onClose={() => handleClose()} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ListPosts;
