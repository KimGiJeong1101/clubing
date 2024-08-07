import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import NotFound from './pages/common/NotFound';
import ClubRoutes from './pages/club/ClubRoutes';
import AuthRoutes from './pages/auth/index'; // 인증 관련 라우트
import MyPageRoutes from './pages/myPage/index'; // 마이페이지 관련 라우트

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/clubs/*' element={<ClubRoutes />} />
        <Route path='/auth/*' element={<AuthRoutes />} />
        <Route path='/mypage/*' element={<MyPageRoutes />} />ㄴ
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
