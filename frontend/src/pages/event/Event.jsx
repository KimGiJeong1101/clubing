import React, { useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import { Container, Fab, Box, Button, Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import EventCreate from './EventCreate';
import EventCard from './EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';

const Event = () => {
    const user = useSelector(state => state.user?.userData?.user || null);
    const isAdmin = user?.roles === 0;

    const [openCreate, setOpenCreate] = useState(false); // EventCreate 모달 열림 상태
    const [openCard, setOpenCard] = useState(false); // EventCard 모달 열림 상태
    const [eventData, setEventData] = useState(null); // 제출할 데이터

    // 모달 열기 및 닫기 함수
    const handleClickOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const handleClickOpenCard = () => setOpenCard(true);
    const handleCloseCard = () => setOpenCard(false);

    // mutation을 사용하여 이벤트 데이터 전송
    const mutation = useMutation({
        mutationFn: (newEvent) => {
            return axiosInstance.post('/events/newEvent', newEvent);
        },
        onSuccess: () => {
            // 성공적으로 등록되었을 때 처리
            console.log('이벤트 등록 성공');
            handleCloseCard();
        },
        onError: () => {
            console.error('이벤트 등록 실패');
        },
    });

    const handleNext = (data) => {
        setEventData(data); // EventCreate에서 넘어온 데이터 저장
        console.log('data :', data)
        setOpenCreate(false); // EventCreate 모달 닫기
        setOpenCard(true); // EventCard 모달 열기
    };

    const handleSubmit = () => {
        // user가 있는 경우에만 이벤트를 생성
        if (user && eventData) {
            mutation.mutate({ ...eventData, writer: user.email });
        }
    };

    return (
        <Container sx={{ height: '650px' }}>
            {isAdmin && (
                <>
                    <Fab
                        onClick={handleClickOpenCreate}
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: "100px",
                            right: "50px",
                            backgroundColor: '#DBC7B5',
                            '&:hover': {
                                backgroundColor: '#A67153',
                            }
                        }}
                    >
                        <AddIcon sx={{ color: '#fff' }} />
                    </Fab>

                    {/* EventCreate 모달 */}
                    <AnimatePresence>
                        {openCreate && (
                            <Backdrop open={true} sx={{ zIndex: 1300 }} onClick={handleCloseCreate}>
                                <motion.div
                                    initial={{ opacity: 0, x: '100vw' }} // 오른쪽 화면 바깥에서 시작
                                    animate={{ opacity: 1, x: '0vw' }} // 중앙으로 이동
                                    exit={{ opacity: 0, x: '-100vw' }} // 왼쪽으로 퇴장
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    onClick={(e) => e.stopPropagation()} // 모달 내부 클릭으로 닫히지 않도록
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 700,
                                            maxHeight: '85vh',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            borderRadius: '8px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <EventCreate
                                            onClose={handleCloseCreate}
                                            onNext={handleNext}
                                        />
                                    </Box>
                                </motion.div>
                            </Backdrop>
                        )}
                    </AnimatePresence>

                    {/* EventCard 모달 */}
                    <AnimatePresence>
                        {openCard && (
                            <Backdrop open={true} sx={{ zIndex: 1300 }} onClick={handleCloseCard}>
                                <motion.div
                                    initial={{ opacity: 0, x: '100vw' }} // 오른쪽 화면 바깥에서 시작
                                    animate={{ opacity: 1, x: '0vw' }} // 중앙으로 이동
                                    exit={{ opacity: 0, x: '-100vw' }} // 왼쪽으로 퇴장
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    onClick={(e) => e.stopPropagation()} // 모달 내부 클릭으로 닫히지 않도록
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 400,
                                            maxHeight: '85vh',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            borderRadius: '8px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <EventCard eventData={eventData} />
                                    </Box>
                                </motion.div>
                            </Backdrop>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Container>
    );
};

export default Event;
