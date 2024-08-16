import React from 'react'
import MyUpdate from './sections/MyUpdate'; // MyUpdate 컴포넌트를 임포트합니다.
import { Box } from '@mui/material';
import MyChat from './sections/MyChat';
import MyList from './sections/MyList';
import MySetting from './sections/MySetting';
import MyWish from './sections/MyWish';

const MyPage = () => {
  return (
    <Box>마마마마 마돈나
      <MyChat /> {/* 컴포넌트*/}
      <MyList /> 
      <MySetting /> 
      <MyUpdate /> 
      <MyWish /> 
    </Box>
  )
}

export default MyPage