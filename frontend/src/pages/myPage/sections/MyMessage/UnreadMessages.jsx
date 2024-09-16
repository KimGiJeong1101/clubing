import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Grid, Dialog, DialogContent, IconButton, TablePagination } from '@mui/material';
import axiosInstance from '../../../../utils/axios';
import CustomButton2 from '../../../../components/club/CustomButton2.jsx'
import CustomButton from '../../../../components/club/CustomButton.jsx'
import MessageRow from '../../../../components/auth/MessageRow'
import MessageModal from '../../../../components/auth/MessageModal'; // MessageModal 컴포넌트 경로
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, markMessageAsRead, deleteMessages } from '../../../../store/actions/myMessageActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RowsPerPageSelector from '../../../../components/auth/RowsPerPageSelector'

const UnreadMessages = () => {
  const dispatch = useDispatch();
  const messagesData = useSelector((state) => state.myMessage.messages);

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

//정보 가져오기
  useEffect(() => {
    if (user.email) {
      dispatch(fetchMessages(user.email)); // 리덕스 액션으로 메시지 가져오기
    }
  }, [user.email, dispatch]);

  useEffect(() => {
    setMessages(messagesData); // 가져온 메시지 데이터를 상태에 설정
  }, [messagesData]);

  const handleReadMessage = (messageId) => {
    // selectedMessages 상태를 업데이트하는 함수
    setSelectedMessages(prevSelected => 
      // prevSelected는 현재 상태 배열입니다.
      // messageId가 현재 선택된 상태 배열에 포함되어 있는지 확인합니다.
      prevSelected.includes(messageId) 
        ? // messageId가 포함되어 있으면 배열에서 messageId를 제거합니다.
          prevSelected.filter(id => id !== messageId) 
        : // messageId가 포함되어 있지 않으면 배열에 messageId를 추가합니다.
          [...prevSelected, messageId]
    );
  };

  const handleMarkAsRead = () => {
    dispatch(markMessageAsRead(selectedMessages))
      .then(() => {
        dispatch(fetchMessages(user.email)); // 메시지를 다시 가져와 상태 업데이트
        setSelectedMessages([]); // 선택 상태 초기화
      })
      .catch((error) => {
        console.error('Error marking messages as read:', error);
      });
  };

  //메시지 삭제
    const handleDelete = () => {
      dispatch(deleteMessages(selectedMessages))
        .then(() => {
          setSelectedMessages([]); // 삭제 후 선택 상태 초기화
        })
        .catch((error) => {
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
          .sort((a, b) => {
            return new Date(b.date) - new Date(a.date); // 내림차순 정렬
          })
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
        <CustomButton onClick={handleMarkAsRead} variant="contained" color="primary" sx={{ mr: 1 }}>읽음으로 표시</CustomButton>
        <CustomButton2 onClick={handleDelete} variant="contained" color="error">삭제</CustomButton2>
      </Box>

       {/* Message Modal */}
       <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogContent>
          {selectedMessage && (
            <MessageModal
              message={selectedMessage}
              selectedMessages={selectedMessages}
              handleReadMessage={handleReadMessage}
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

export default UnreadMessages;
