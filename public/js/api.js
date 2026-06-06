const BASE_URL = 'http://localhost:5000/api';

// Токенро гирифтан
const getToken = () => localStorage.getItem('token');

// Корбари кунуниро гирифтан
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

// Логин санҷидан
const isLoggedIn = () => !!getToken();

// Аз система баромадан
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Дархости асосӣ
const apiRequest = async (method, endpoint, data = null, isFormData = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const config = {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : null
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await res.json();

  if (!res.ok) throw new Error(result.message || 'Хатогӣ рӯй дод');
  return result;
};

// API функсияҳо
const API = {
  // Auth
  register: (data) => apiRequest('POST', '/auth/register', data),
  login: (data) => apiRequest('POST', '/auth/login', data),

  // Устоҳо
  getAllWorkers: (params = '') => apiRequest('GET', `/workers?${params}`),
  getWorkerProfile: () => apiRequest('GET', '/workers/profile'),
  updateWorkerProfile: (data) => apiRequest('PUT', '/workers/profile', data),
  toggleStatus: () => apiRequest('PATCH', '/workers/status'),
  addPortfolio: (formData) => apiRequest('POST', '/workers/portfolio', formData, true),

  // Фармоишҳо
  createOrder: (formData) => apiRequest('POST', '/orders', formData, true),
  getAllOrders: (params = '') => apiRequest('GET', `/orders?${params}`),
  getMyOrders: () => apiRequest('GET', '/orders/my'),
  getOrderById: (id) => apiRequest('GET', `/orders/${id}`),
  respondToOrder: (id, data) => apiRequest('POST', `/orders/${id}/respond`, data),
  assignWorker: (id, data) => apiRequest('PATCH', `/orders/${id}/assign`, data),
  closeOrder: (id) => apiRequest('PATCH', `/orders/${id}/close`),

  // Отзывҳо
  createReview: (formData) => apiRequest('POST', '/reviews', formData, true),
  getWorkerReviews: (workerId) => apiRequest('GET', `/reviews/${workerId}`),

  // Паёмҳо
  sendMessage: (formData) => apiRequest('POST', '/messages', formData, true),
  getMessages: (orderId) => apiRequest('GET', `/messages/${orderId}`),
  getMyChats: () => apiRequest('GET', '/messages/chats'),
};

// Тост нишон додан
const showToast = (message, type = '') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Ситораҳо нишон додан
const renderStars = (rating) => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
};

// Санаро формат кардан
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tg-TJ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};