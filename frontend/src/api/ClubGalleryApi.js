import axios from "axios";

// 이미지 등록 API 요청 함수
export const registerImages = (clubNumber, newImages) => {
    return axios.post(`http://localhost:4000/clubs/${clubNumber}/gallery/images`, newImages);
  };
  
  // 이미지 목록을 서버에서 가져오는 함수 (조회 로직)
  export const fetchImages = async (clubNumber) => {
    const { data } = await axios.get(`http://localhost:4000/clubs/${clubNumber}/gallery/images`);
    return data;
  };
  
  // 선택한 이미지들을 삭제하는 함수 (삭제 로직)
export const deleteImages = async (clubNumber, { imageIds, writer }) => {
  await axios.delete(`http://localhost:4000/clubs/${clubNumber}/gallery/images`, {
    data: { imageIds, writer } // imageIds와 writer를 함께 전송
  });
};

  
// 모든 이미지를 삭제하는 함수 (전체 삭제 로직)
export const deleteAllImages = async (clubNumber, { writer }) => {
  await axios.delete(`http://localhost:4000/clubs/${clubNumber}/gallery/images/all`, {
    data: { writer }, // writer 정보를 요청 데이터로 포함시킴
  });
};

  
  // 이미지를 수정하는 함수 (수정 로직)
  export const editImage = async (clubNumber, { id, formData }) => {
    await axios.put(`http://localhost:4000/clubs/${clubNumber}/gallery/images/${id}`, formData);
  };