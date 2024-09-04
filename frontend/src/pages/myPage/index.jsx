import { Routes, Route } from 'react-router-dom';
import MyUpdate from './sections/MyUpdate';
import MyClub from './sections/MyClub';
import MyWish from './sections/MyWish';
import MyChat from './sections/MyChat';
import MySetting from './sections/MySetting';
import MyPage from './MyPage';

//여기까지 경로 /mypage
function MyPageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MyPage />} />  
      <Route path="update" element={<MyUpdate />} />
      <Route path="club" element={<MyClub />} />
      <Route path="wish" element={<MyWish />} />
      <Route path="chat" element={<MyChat />} />
      <Route path="setting" element={<MySetting />} />
    </Routes>
  );
}

export default MyPageRoutes;
