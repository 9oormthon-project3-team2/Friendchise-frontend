import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 서버 API URL로 변경
});

export default axiosInstance;
