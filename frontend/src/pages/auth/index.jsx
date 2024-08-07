import { Routes, Route } from 'react-router-dom';
import Login from './index';
import Join from './Join';
import JoinKakao from './JoinKakao';

function AuthRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='join' element={<Join />} />
      <Route path='join/kakao' element={<JoinKakao />} />
      {/* 추가적인 인증 관련 라우트는 여기에 추가 */}
    </Routes>
  );
}

export default AuthRoutes;
