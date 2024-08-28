import axios from "axios";

// 환경 변수 설정을 수정합니다.
const isProduction = process.env.NODE_ENV === "production";
// 프로덕션 환경 (Production)
// URL 예시: https://myapp.example.com
// 실제 사용자에게 제공되는 환경. 배포된 서버에서 실행되며, 안정성, 보안, 성능이 중요한 요소입니다.
const axiosInstance = axios.create({
  baseURL: isProduction ? "" : "http://localhost:4000",
  withCredentials: true, // 모든 요청에 쿠키와 자격 증명을 포함
  //설정은 필요하며, 이 설정이 없으면 서버가 쿠키에 담긴 JWT를 읽을 수 없어서 인증에 문제가 생길 수 있습니다.
  timeout: 3000 // 타임아웃을 3초로 설정
});

// 요청 인터셉터 (액세스 토큰을 헤더에 추가하지 않음)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);
// 응답 인터셉터
let isRedirecting = false; // 리다이렉트 중복 방지 플래그

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      alert('요청이 시간 초과되었습니다. 다시 시도해주세요.');
    } else if (error.response?.status === 401 || error.response?.data === "jwt expired") {
      isRedirecting = true; // 리다이렉트가 진행 중임을 표시
      alert('로그인을 다시 해주세요');
      window.location.reload(); // 페이지 새로고침
      //window.location.href = '/login';
    } else {
      console.error('오류 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;