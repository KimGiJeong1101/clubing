import { Routes, Route } from "react-router-dom";
import MainRoutes from "./main/MainRoutes";
import BoardRoutes from "./board/BoardRoutes";
import GalleryRoutes from "./gallery/GalleryRoutes";
import MeetingRoutes from "./meeting/MeetingRoutes";

//여기까지 경로 /clubs
function ClubRoutes() {
  return (
    <Routes>
      <Route path="main/*" element={<MainRoutes />} />
      <Route path="board/*" element={<BoardRoutes />} />
      <Route path="gallery/*" element={<GalleryRoutes />} />
      <Route path="meeting/*" element={<MeetingRoutes />} />
    </Routes>
  );
}

export default ClubRoutes;
