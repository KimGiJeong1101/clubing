import { Routes, Route } from 'react-router-dom';
import Gallery from './Gallery';
import GalleryCreate from './GalleryCreate';
import GalleryUpdate from './GalleryUpdate';

//여기까지 경로 /clubs/galleries 
function GalleryRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Gallery />} />
      <Route path='create' element={<GalleryCreate />} />
      <Route path='update/:id' element={<GalleryUpdate />} />
    </Routes>
  );
}

export default GalleryRoutes;
