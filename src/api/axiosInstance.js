import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 서버 API URL로 변경
});

// 요청 인터셉터 추가: 요청 전 헤더에 토큰 삽입
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// 응답 인터셉터: 401 오류 발생 시 토큰 재발급 로직 추가 가능
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 예시: 401 발생 시 /manager/reissue 호출
    if (error.response?.status === 401) {
      // 토큰 재발급 로직 구현 (필요에 따라)
      // const refreshToken = localStorage.getItem('refreshToken');
      // const response = await axios.post('/manager/reissue', { refreshToken }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      // localStorage.setItem('accessToken', response.data.accessToken);
      // localStorage.setItem('refreshToken', response.data.refreshToken);
      // error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      // return axiosInstance.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
