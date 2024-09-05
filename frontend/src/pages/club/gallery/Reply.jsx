import React, { useState } from 'react';
import { Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko'; // 한국어 locale 불러오기

// moment의 locale을 한국어로 설정
moment.locale('ko');

const Reply = ({ postType, postId, writer }) => {
    const [comment, setComment] = useState('');

    const queryClient = useQueryClient();

    const { data: replies, isLoading, isError, error } = useQuery({
        queryKey: ['replies', postType, postId],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:4000/replies/${postId}`);
            return response.data.replies;  // replies 배열만 반환
        },
        retry: 3,
    });

    const mutation = useMutation({
        mutationFn: (newComment) => {
            // postId를 URL에 포함시켜 요청 보냄
            return axios.post(`http://localhost:4000/replies/add/${newComment.postId}`, newComment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['replies', postType, postId]);
            setComment('');
        },
    });

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 엔터로 줄바꿈이 아닌 댓글 전송을 방지
            handleCommentSubmit(); // 댓글 제출
        }
    };

    const handleCommentSubmit = () => {
        if (comment.trim() === '') return;
        mutation.mutate({
            postType,
            postId,
            writer,
            comment, // 줄바꿈 처리를 그대로 보내줌
        });
    };

    return (
        <Box
            sx={{
                height: '200px',
                maxHeight: '400px',
                p: 0.5,
                border: '1px solid grey',
                borderRadius: '8px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h9" component="h2" sx={{ marginBottom: 1, marginTop: 0 }}>
                Comments
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mb: 1,
                    position: 'relative',
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Typography color="error">
                        {`Error: ${error.message}`}
                    </Typography>
                ) : Array.isArray(replies) && replies.length > 0 ? (
                    replies.map((reply, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                                alignItems: 'center', // 수평 정렬
                                width: '100%' // 전체 너비를 사용
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    maxWidth: '80%', // 댓글 부분의 최대 너비 설정
                                    wordBreak: 'break-word', // 단어가 넘칠 경우 줄바꿈 처리
                                    whiteSpace: 'pre-wrap', // 줄바꿈 및 공백 유지
                                }}
                            >
                                {`${reply.writer} : ${reply.comment}`}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'gray',
                                    marginLeft: '8px',
                                    whiteSpace: 'nowrap' // 시간 부분은 줄바꿈 없이 한 줄로 표시
                                }}
                            >
                                {moment(reply.createdAt).fromNow()} {/* 몇 분/시간/일 전 한글로 표시 */}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>No comments available</Typography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="댓글을 입력하세요"
                    value={comment}
                    onChange={handleCommentChange}
                    onKeyDown={handleKeyDown} // 키다운 이벤트 처리
                    multiline // 줄바꿈 가능하도록 설정
                    minRows={1} // 최소 줄 수
                    maxRows={10} // 최대 줄 수
                    sx={{
                        mb: 1,
                        '& .MuiInputBase-root': {
                            paddingTop: '0px',
                            paddingBottom: '0px',
                            minHeight: '32px',
                        },
                        '& .MuiOutlinedInput-input': {
                            paddingTop: '4px',
                            paddingBottom: '4px',
                        },
                        '& .MuiOutlinedInput-root': {
                            minHeight: '32px',
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    color="primary"
                                    onClick={handleCommentSubmit}
                                    sx={{
                                        padding: '4px',
                                    }}
                                >
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
}

export default Reply;
