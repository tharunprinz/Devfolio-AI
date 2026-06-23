import axios from 'axios';

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  if (url && !url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to append the JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle auth errors (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('devfolio_token');
      localStorage.removeItem('devportfolio_user');
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  loginWithGitHub: (code, redirectUri) => apiClient.post('/auth/github', { code, redirectUri }),
  logout: () => {
    localStorage.removeItem('devfolio_token');
    localStorage.removeItem('devportfolio_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('devportfolio_user');
    return user ? JSON.parse(user) : null;
  }
};

export const githubApi = {
  getRepos: () => apiClient.get('/github/repos'),
  syncRepos: () => apiClient.post('/github/sync'),
};

export const projectsApi = {
  analyzeRepo: (repoId) => apiClient.post(`/projects/${repoId}/analyze`),
  overrideAnalysis: (repoId, data) => apiClient.put(`/projects/${repoId}/override`, data),
};

export const portfoliosApi = {
  getPortfolios: () => apiClient.get('/portfolios'),
  getPortfolio: (id) => apiClient.get(`/portfolios/${id}`),
  createPortfolio: (templateName) => apiClient.post('/portfolios', { templateName }),
  updatePortfolio: (id, data) => apiClient.put(`/portfolios/${id}`, data),
  getPublicPortfolio: (publishedUrl) => axios.get(`${API_BASE_URL}/public/portfolios/${publishedUrl}`),
  queryChatbot: (publishedUrl, question, history) => 
    axios.post(`${API_BASE_URL}/public/portfolios/${publishedUrl}/chat`, { question, history }),
};

export const resumesApi = {
  getResumes: () => apiClient.get('/resumes'),
  getResume: (id) => apiClient.get(`/resumes/${id}`),
  createResume: (templateName) => apiClient.post('/resumes', { templateName }),
  updateResume: (id, data) => apiClient.put(`/resumes/${id}`, data),
  polishResume: (id, instructions) => apiClient.post(`/resumes/${id}/polish`, { instructions }),
};

export const aiApi = {
  getInsights: () => apiClient.get('/ai/insights'),
  regenerateInsights: () => apiClient.post('/ai/insights/regenerate'),
  getRoast: () => apiClient.get('/ai/roast'),
  generateCoverLetter: (jobDescription, companyName, roleTitle) => 
    apiClient.post('/ai/cover-letter', { jobDescription, companyName, roleTitle }),
  generateLinkedInAbout: (tone) => apiClient.post('/ai/linkedin-about', { tone }),
};

export default apiClient;
