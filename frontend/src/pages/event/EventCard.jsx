import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import EventImageCropper from './EventImageCropper';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const EventCard = ({ eventData }) => {
    const [title, setTitle] = useState(''); // 기본 제목
    const [contentText, setContentText] = useState(''); // 텍스트 내용
    const [mainImage, setMainImage] = useState(''); // 첫 번째 이미지 (base64 형식)
    const [cardImage, setCardImage] = useState(''); // 새로 업로드된 카드 이미지 (파일명)
    const [cardTitle, setCardTitle] = useState(''); // 수정된 카드 제목
    const [editTitle, setEditTitle] = useState(false); // 제목 수정 모드 상태
    const [showCropper, setShowCropper] = useState(false); // 이미지 크롭 모드
    const [croppedImage, setCroppedImage] = useState(''); // 크롭된 이미지 URL
    const fileInputRef = useRef(null); // 파일 입력 요소를 참조할 ref

    const writer = useSelector(state => state.user?.userData?.user?.email); // writer 정보

    // 첫 번째 <img> 태그에서 src 속성을 추출하는 함수
    const extractFirstImageSrc = (htmlContent) => {
        const imgTag = htmlContent.match(/<img[^>]+src="([^">]+)"/);
        return imgTag ? imgTag[1] : '';
    };

    // HTML에서 텍스트만 추출하는 함수
    const extractTextContent = (htmlContent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    useEffect(() => {
        if (eventData) {
            setTitle(eventData.title || ''); // 초기 제목 설정
            setMainImage(extractFirstImageSrc(eventData.content || '')); // 첫 번째 이미지 추출
            setContentText(extractTextContent(eventData.content || '')); // 텍스트 추출
        }
    }, [eventData]);

    useEffect(() => {
        // cardImage가 업데이트 될 때마다 로그를 출력
        if (cardImage) {
            console.log('cardImage :', cardImage);
        }
    }, [cardImage]);

    // base64 형식으로 파일을 변환하는 함수
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    // base64 문자열을 Blob 객체로 변환하는 함수
    const base64ToBlob = (base64) => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const buffer = new ArrayBuffer(byteString.length);
        const array = new Uint8Array(buffer);
        for (let i = 0; i < byteString.length; i++) {
            array[i] = byteString.charCodeAt(i);
        }
        return new Blob([buffer], { type: mimeString });
    };

    // 파일 업로드 핸들러
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64Image = await toBase64(file); // base64로 변환
            setMainImage(base64Image); // 변환된 base64 이미지를 설정
            setShowCropper(true); // 크롭 모달 열기
        }
    };

    // 이미지 클릭 시 파일 선택 창 열기
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // 제목 클릭 시 수정 모드로 전환
    const handleTitleClick = () => {
        setEditTitle(true);
    };

    // 제목 수정 완료 시 저장
    const handleTitleSave = () => {
        setTitle(cardTitle); // cardTitle로 제목 설정
        setEditTitle(false); // 수정 모드 해제
    };

    // 크롭 완료 시 호출되는 함수
    const handleCropComplete = (croppedImageUrl) => {
        setCroppedImage(croppedImageUrl); // 크롭된 이미지 설정
        setCardImage(croppedImageUrl); // 크롭된 이미지를 카드 이미지로 설정
        setShowCropper(false); // 크롭 모달 닫기
    };

    // 이미지를 서버에 업로드하는 함수
    const uploadImageToServer = async () => {
        if (mainImage) {
            const blob = base64ToBlob(mainImage); // base64를 Blob으로 변환
            const formData = new FormData();
            formData.append('file', blob, 'image.png'); // Blob 파일을 FormData로 추가

            try {
                const response = await axios.post('http://localhost:4000/events/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const uploadedFileName = response.data.filename; // 서버로부터 받은 파일명
                setCardImage(uploadedFileName); // cardImage에 파일명 설정
                return uploadedFileName;
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert('이미지 업로드 실패');
                throw error;
            }
        }
    };

    // 서버로 데이터를 전송하는 함수 (useMutation 활용)
    const mutation = useMutation(async (dataToSend) => {
        const response = await axios.post('http://localhost:4000/events/newEvent', dataToSend);
        return response.data;
    });

    // 제출 버튼 핸들러
    const handleSubmit = async () => {
        try {
            const uploadedFileName = await uploadImageToServer(); // 이미지 업로드 후 파일명 받기
            const dataToSend = {
                title: title || eventData.title, // 새로 수정한 제목이 있으면 그 제목을, 없으면 초기 제목
                content: eventData.content, // 초기 content 그대로 전송
                cardImage: uploadedFileName || cardImage, // 새로 업로드된 파일명 또는 기존 cardImage
                cardTitle: cardTitle || title, // 새로 수정한 카드 제목이 있으면 그 제목을, 없으면 기존 제목
                writer: writer, // 작성자 정보
            };

            mutation.mutate(dataToSend, {
                onSuccess: (data) => {
                    console.log("서버 응답:", data);
                    alert('이벤트가 성공적으로 등록되었습니다.');
                },
                onError: (error) => {
                    console.error('이벤트 등록 오류:', error);
                    alert('이벤트 등록에 실패했습니다.');
                },
            });
        } catch (error) {
            console.error('제출 실패:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%', m: '10px' }}>
            <Typography variant="h6" gutterBottom>
                리스트 카드 모델링
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                {/* 카드 영역 */}
                <Card sx={{ width: '350px', height: 'auto', margin: 0 }}> {/* 카드 크기 설정 및 여백 제거 */}
                    <CardMedia
                        component="img"
                        alt={title || '이미지 없음'}
                        height="200"
                        image={croppedImage || cardImage || mainImage || 'https://via.placeholder.com/345x140?text=No+Image'}
                        onClick={handleImageClick} // 이미지 클릭 시 파일 선택 창 열기
                        sx={{ cursor: 'pointer', objectFit: 'cover', width: '100%', height: '200px' }} // 이미지 크기 고정 및 맞춤 설정
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', m: '10px' }}>
                        <CardContent sx={{ padding: 0, flex: 1 }}>
                            {/* 제목 수정 모드 */}
                            {editTitle ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        value={cardTitle}
                                        onChange={(e) => setCardTitle(e.target.value)}
                                        label="새로운 제목"
                                        variant="outlined"
                                        size="small"
                                        sx={{ marginRight: 1 }}
                                    />
                                    <Button onClick={handleTitleSave} variant="contained" size="small">
                                        저장
                                    </Button>
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="black"
                                    sx={{
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        whiteSpace: 'normal',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleTitleClick}
                                >
                                    {title || '기본 타이틀'}
                                </Typography>
                            )}
                        </CardContent>
                        <MoreVertIcon sx={{ fontSize: 28, cursor: 'pointer', ml: 1 }} /> {/* 아이콘 크기 조정 */}
                    </Box>
                    <Box sx={{ padding: '0 20px' }}>
                        <Typography fontSize={10}>조회수 : 100</Typography>
                        <Typography fontSize={10}>24-00-00 00:00:00</Typography>
                    </Box>
                    <CardActions>
                        <Button size="small">공유</Button>
                        <Button size="small">더 보기</Button>
                    </CardActions>
                </Card>
            </Box>

            {/* 제출 버튼 추가 */}
            <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 2, left: '140px' }}
            >
                제출
            </Button>

            {/* 파일 입력 요소 (숨김 처리) */}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageUpload}
            />

            {/* 이미지 크롭 모달 */}
            {showCropper && (
                <EventImageCropper
                    src={mainImage || cardImage}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropper(false)} // 모달 닫기
                />
            )}
        </Box>
    );
};

export default EventCard;
