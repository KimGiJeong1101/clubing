import { Routes, Route } from 'react-router-dom';
import Gallery from './Gallery';


//여기까지 경로 /clubs/galleries 
function GalleryRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Gallery />} />
    </Routes>
  );
}

export default GalleryRoutes;
