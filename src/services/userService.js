import api from './api';

const searchClients = async (q) => {
  const response = await api.get('/users/clients', { params: { q } });
  return response.data;
};

const lookupClient = async (email) => {
  const response = await api.get('/users/clients/lookup', { params: { email } });
  return response.data;
};

export const userService = {
  searchClients,
  lookupClient,
};
