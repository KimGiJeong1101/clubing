import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Grid, Dialog, DialogContent, TablePagination, IconButton, } from '@mui/material';
import axiosInstance from '../../../../utils/axios';
import CustomButton2 from '../../../../components/club/CustomButton2.jsx'
import MessageRow from '../../../../components/auth/MessageRow'
import MessageModal from '../../../../components/auth/MessageModal'; // MessageModal 컴포넌트 경로
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RowsPerPageSelector from '../../../../components/auth/RowsPerPageSelector'

const ReadMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // 선택된 메시지 상태
  const [openModal, setOpenModal] = useState(false); // 모달 열림/닫힘 상태

  const user = useSelector((state) => state.user?.userData?.user || {});

  // 페이징 상태 추가
  const [page, setPage] = useState(0); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(3); // 페이지당 항목 수

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalPages = Math.ceil(messages.length / rowsPerPage);

  useEffect(() => {
    if (user.email) { // user.email이 있을 경우에만 요청
      axiosInstance.get(`/users/messages/${user.email}/true`)
        .then(response => 
          setMessages(response.data))
        .catch(error => 
          console.error('Error fetching messages:', error));
    }
  }, [user.email]);
  
  const handleReadMessage = (messageId) => {
    setSelectedMessages(prevSelected => 
      prevSelected.includes(messageId) 
        ? prevSelected.filter(id => id !== messageId) 
        : [...prevSelected, messageId]
    );
  };

  const handleDelete = () => {
    // 선택한 메시지를 삭제하는 API 호출
    axiosInstance.post('/users/messages/delete', { ids: selectedMessages })
      .then(response => {
        // 성공 시 메시지 목록 갱신
        setMessages(prevMessages => 
          prevMessages.filter(msg => !selectedMessages.includes(msg._id))
        );
        // 선택 상태 초기화
        setSelectedMessages([]);
      })
      .catch(error => {
        console.error('Error deleting messages:', error);
        // 오류 처리: 사용자에게 오류 메시지 표시 또는 기타 조치
      });
  };

  const handleOpenModal = (message) => {
    setSelectedMessage(message);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMessage(null);
  };

  return (
    <Box>
      {/* 메시지 보이고 싶은 량 */}
      <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
        <RowsPerPageSelector rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
      </Box>
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* 테이블 헤더 내용 */}
        </TableHead>
        <TableBody>
          {messages
           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 현재 페이지와 항목 수에 맞게 데이터 슬라이싱
           .sort((a, b) => new Date(b.date) - new Date(a.date)) // 내림차순 정렬
          .map(message => (
            <TableRow key={message._id} onClick={() => handleOpenModal(message)} style={{ cursor: 'pointer' }}>
              <MessageRow
                message={message}
                selectedMessages={selectedMessages}
                handleReadMessage={handleReadMessage}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <CustomButton2 onClick={handleDelete} variant="contained" color="error">삭제</CustomButton2>
          </Box>

          {/* Message Modal */}
          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogContent>
              {selectedMessage && (
                <MessageModal
                  message={selectedMessage}
                  selectedMessages={selectedMessages}
                  handleReadMessage ={handleReadMessage}
                  onClose={handleCloseModal} // 모달 닫기 핸들러 전달
                />
              )}
            </DialogContent>
          </Dialog>

      {/* Table Pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <IconButton onClick={() => setPage(prevPage => Math.max(prevPage - 1, 0))} disabled={page === 0}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <IconButton
                  key={index}
                  onClick={() => setPage(index)}
                  sx={{ mx: 0.5 }}
                  color={page === index ? 'primary' : 'default'}
                >
                  <Typography variant="body2">{index + 1}</Typography>
                </IconButton>
              ))}
            </Box>
            <IconButton onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages - 1))} disabled={page >= totalPages - 1}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
      );
    };


export default ReadMessages;
