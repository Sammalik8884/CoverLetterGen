// Centralized API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5026'

// Helper function to get full API endpoint
export const getApiEndpoint = (endpoint) => {
  return `${API_URL}${endpoint}`
}

// Helper function to get API headers
// Note: Cookies are automatically sent with requests when withCredentials: true is set
export const getApiHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  // For cookie-based authentication, we don't need to manually add auth headers
  // The browser will automatically send cookies with requests when withCredentials: true
  
  return headers
} 