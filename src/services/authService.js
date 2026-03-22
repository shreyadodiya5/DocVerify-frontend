import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error', error);
  }
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const authService = {
  login,
  register,
  logout,
  getMe,
};
