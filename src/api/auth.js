// src/api/auth.js
import axios from 'axios';

export const reissueToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await axios.post(
      '/manager/reissue',
      { refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.accessToken;
  } catch (error) {
    throw error;
  }
};
