import React from 'react';
import AddIcon from "@mui/icons-material/Add";
import { Container, Fab } from '@mui/material';
import { useSelector } from 'react-redux';

const Event = () => {
    const user = useSelector(state => state.user?.userData?.user || null);
    const isAdmin = user.roles;

    console.log('isAdmin', isAdmin);

    // 버튼을 클릭했을 때 실행되는 함수
    const handleClickOpen = () => {
        console.log("Add button clicked!");
    };

    return (
        <Container>
            {isAdmin === 0 && (
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
            )}
        </Container>
    );
}

export default Event;
