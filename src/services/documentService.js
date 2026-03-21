import api from './api';

const uploadDocuments = async (token, formData) => {
  const response = await api.post(`/documents/upload/${token}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const uploadDocumentsAuthenticated = async (requestId, formData) => {
  const response = await api.post(`/documents/upload/auth/${requestId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getDocumentsByRequest = async (requestId) => {
  const response = await api.get(`/documents/request/${requestId}`);
  return response.data;
};

const verifyDocument = async (id) => {
  const response = await api.put(`/documents/${id}/verify`);
  return response.data;
};

const rejectDocument = async (id, remarks) => {
  const response = await api.put(`/documents/${id}/reject`, { remarks });
  return response.data;
};

const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const documentService = {
  uploadDocuments,
  uploadDocumentsAuthenticated,
  getDocumentsByRequest,
  verifyDocument,
  rejectDocument,
  deleteDocument,
};
