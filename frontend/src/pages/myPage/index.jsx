import { Routes, Route } from 'react-router-dom';
import MyUpdate from './sections/MyUpdate/MyUpdate';
import MyClub from './sections/MyClub/MyClub';
import MyMessage from './sections/MyMessage';
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
      <Route path="MyMessage" element={<MyMessage />} />
      <Route path="chat" element={<MyChat />} />
      <Route path="setting" element={<MySetting />} />
    </Routes>
  );
}

export default MyPageRoutes;
