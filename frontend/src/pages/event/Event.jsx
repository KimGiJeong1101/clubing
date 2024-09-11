import React, { useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import { Container, Fab, Modal, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import EventCreate from './EventCreate'; // CKEditor 컴포넌트 포함된 EventCreate 가져오기

const Event = () => {
    const user = useSelector(state => state.user?.userData?.user || null);
    const isAdmin = user.roles;

    const [open, setOpen] = useState(false); // 모달 열림 상태 관리

    // 모달 열기 함수
    const handleClickOpen = () => {
        setOpen(true);
    };

    // 모달 닫기 함수
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            {isAdmin === 0 && (
                <>
                    <Fab
                        onClick={handleClickOpen}
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: "50px",
                            right: "50px",
                            backgroundColor: '#DBC7B5',
                            '&:hover': {
                                backgroundColor: '#A67153',
                            }
                        }}
                    >
                        <AddIcon sx={{ color: '#fff' }} />
                    </Fab>

                    {/* Modal 추가 */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 800, // 모달 크기 설정
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            {/* CKEditor 컴포넌트를 포함한 EventCreate 컴포넌트 */}
                            <EventCreate onClose={handleClose} />
                        </Box>
                    </Modal>
                </>
            )}
        </Container>
    );
}

export default Event;
