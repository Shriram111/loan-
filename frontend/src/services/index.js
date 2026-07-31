import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const loanService = {
  create: (data) => api.post('/loans', data),
  getAll: (params) => api.get('/loans', { params }),
  getById: (id) => api.get(`/loans/${id}`),
  update: (id, data) => api.put(`/loans/${id}`, data),
  delete: (id) => api.delete(`/loans/${id}`),
  submit: (id) => api.post(`/loans/${id}/submit`),
  assign: (id, data) => api.put(`/loans/${id}/assign`, data),
};

export const documentService = {
  upload: (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getByApplication: (applicationId) => api.get(`/documents/${applicationId}`),
  verify: (id, data) => api.put(`/documents/${id}/verify`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const verificationService = {
  verifyCibil: (data) => api.post('/verification/cibil', data),
  verifyEpf: (data) => api.post('/verification/epf', data),
  verifySalary: (data) => api.post('/verification/salary', data),
  verifyDigilocker: (data) => api.post('/verification/digilocker', data),
  verifySelfie: (data) => api.post('/verification/selfie', data),
  verifyLiveness: (data) => api.post('/verification/liveness', data),
  generateAiNotes: (data) => api.post('/verification/ai-notes', data),
};

export const auditService = {
  getDashboard: () => api.get('/audits/dashboard'),
  getApplication: (applicationId) => api.get(`/audits/${applicationId}`),
  submitAudit: (applicationId, data) => api.post(`/audits/${applicationId}`, data),
  generateReport: (applicationId) => api.post(`/audits/${applicationId}/report`),
};

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getAnalytics: () => api.get('/admin/analytics'),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const financialService = {
  getProducts: () => api.get('/financial/products'),
  createProduct: (data) => api.post('/financial/products', data),
  updateProduct: (id, data) => api.put(`/financial/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/financial/products/${id}`),
  getInterestRates: () => api.get('/financial/interest-rates'),
  createInterestRate: (data) => api.post('/financial/interest-rates', data),
  updateInterestRate: (id, data) => api.put(`/financial/interest-rates/${id}`, data),
  calculateEmi: (data) => api.post('/financial/emi-calculator', data),
};
