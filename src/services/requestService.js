import api from './api';

const createRequest = async (requestData) => {
  const response = await api.post('/requests', requestData);
  return response.data;
};

const getRequests = async () => {
  const response = await api.get('/requests');
  return response.data;
};

const getRequestById = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};

const updateRequestStatus = async (id, status) => {
  const response = await api.put(`/requests/${id}/status`, { status });
  return response.data;
};

const deleteRequest = async (id) => {
  const response = await api.delete(`/requests/${id}`);
  return response.data;
};

const verifyAccessToken = async (token) => {
  const response = await api.get(`/requests/verify/${token}`);
  return response.data;
};

const resendNotification = async (id) => {
  const response = await api.post(`/requests/${id}/resend`);
  return response.data;
};

const submitRequestForReview = async (id) => {
  const response = await api.post(`/requests/${id}/submit`);
  return response.data;
};

export const requestService = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  verifyAccessToken,
  resendNotification,
  submitRequestForReview,
};
