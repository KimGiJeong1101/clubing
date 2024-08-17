import axios from "axios";

// 환경 변수 설정을 수정합니다.
const isProduction = process.env.NODE_ENV === "production";
// 프로덕션 환경 (Production)
// URL 예시: https://myapp.example.com
// 실제 사용자에게 제공되는 환경. 배포된 서버에서 실행되며, 안정성, 보안, 성능이 중요한 요소입니다.

const axiosInstance = axios.create({
  baseURL: isProduction ? "" : "http://localhost:4000",
  withCredentials: true, // 모든 요청에 쿠키와 자격 증명을 포함
  timeout: 3000 // 타임아웃을 3초로 설정
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.code === 'ECONNABORTED') {
      alert('요청이 시간 초과되었습니다. 다시 시도해주세요.');
    } else if (error.response && error.response.data === "jwt expired") {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
