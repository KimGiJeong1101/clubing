// theme.js
import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'NanumSquareNeoBold, NanumSquareNeoExtraBold, KCC-Hanbit', // 공통 글씨체 설정
  },
  // 추가적인 테마 설정이 필요할 경우 여기에 작성
});

// GlobalStyles를 사용하여 body 스타일을 적용
export const GlobalStyle = () => (
  <GlobalStyles
    styles={{
      body: {
        fontFamily: 'KCC-Hanbit', 
        backgroundColor: '#f0f0f0',  /* 페이지 배경 색상 설정 */
      },
    }}
  />
);

export default theme;
