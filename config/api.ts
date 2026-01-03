// API Configuration
// Update this URL after deploying the Vercel function

export const API_CONFIG = {
  // Your Vercel deployment URL
  BASE_URL: 'https://ascend-app-phi.vercel.app',
  
  // Endpoints
  ENDPOINTS: {
    ANALYZE_FACE: '/api/analyze-face',
  },
  
  // Request timeout (120 seconds for AI processing + large image upload)
  TIMEOUT: 120000,
};

export const getAnalyzeUrl = () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_FACE}`;

