import { Routes, Route } from "react-router-dom";
import MainPage from "./main/Main";
import BoardRoutes from "./board/BoardRoutes";
import GalleryRoutes from "./gallery/GalleryRoutes";
import MeetingRoutes from "./meeting/MeetingRoutes";

//여기까지 경로 /clubs
function ClubRoutes() {
  return (
    <Routes>
      <Route path="main/*" element={<MainPage />} />
      <Route path="boards/*" element={<BoardRoutes />} />
      <Route path="galleries/*" element={<GalleryRoutes />} />
      <Route path="meetings/*" element={<MeetingRoutes />} />
    </Routes>
  );
}

export default ClubRoutes;
