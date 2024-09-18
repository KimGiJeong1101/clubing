import React from 'react';
import { Container, Box, Typography } from '@mui/material';


const EventDetail = ({ event }) => {
    if (!event) return <div>이벤트를 찾을 수 없습니다</div>;
    console.log(event)

    return (
        <Container>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h4" gutterBottom>
                    {event.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    작성자: {event.writer}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    종료일: {event.endTime ? new Date(event.endTime).toLocaleDateString() : '없음'}
                </Typography>

                <div className="fetched-content">
                    {/* CKEditor5ReadOnlyEditor를 사용하여 콘텐츠를 리드온리로 렌더링 */}

                </div>
            </Box>
        </Container>
    );
};

export default EventDetail;
