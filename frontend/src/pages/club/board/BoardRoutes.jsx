import { Routes, Route } from 'react-router-dom';
import Board from './Board';
import BoardCreate from './BoardCreate';
import BoardUpdate from './BoardUpdate';


//여기까지 경로 /clubs/boards 
function BoardRoutes() {
  return (
     
    <Routes>
      <Route path='' element={<Board />} />
      <Route path='/create' element={<BoardCreate />} />
      <Route path='update/:id' element={<BoardUpdate />} />
    </Routes>
  );
}

export default BoardRoutes;