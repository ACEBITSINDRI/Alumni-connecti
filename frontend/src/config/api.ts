// API Configuration for Alumni Connect
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5001'
    : 'https://alumni-connect-84d49.web.app');

export default API_BASE_URL;

// Export common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,

  // Users
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  USERS: `${API_BASE_URL}/api/users`,

  // Posts
  POSTS: `${API_BASE_URL}/api/posts`,

  // Events
  EVENTS: `${API_BASE_URL}/api/events`,

  // Opportunities
  OPPORTUNITIES: `${API_BASE_URL}/api/opportunities`,

  // Messages
  MESSAGES: `${API_BASE_URL}/api/messages`,
  CONVERSATIONS: `${API_BASE_URL}/api/conversations`,

  // Health Check
  HEALTH: `${API_BASE_URL}/health`,
};
