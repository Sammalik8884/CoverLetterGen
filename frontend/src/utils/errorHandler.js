// Centralized error handling utility
import { API_URL } from './apiConfig'

/**
 * Standardized error handler for API calls
 * @param {Error} err - The error object from axios
 * @param {string} operation - Description of the operation that failed
 * @param {Object} options - Additional options
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (err, operation = 'API call', options = {}) => {
  const {
    showBackendUrl = true,
    redirectOnAuth = true,
    customMessages = {}
  } = options

  console.error(`${operation} error:`, err)

  // Network errors
  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    const backendUrl = showBackendUrl ? ` on ${API_URL}` : ''
    return `Unable to connect to server${backendUrl}. Please check if the backend is running.`
  }

  // Timeout errors
  if (err.code === 'ECONNABORTED') {
    return 'Request timed out. Please check if the backend server is running.'
  }

  // HTTP status code errors
  if (err.response?.status) {
    const status = err.response.status

    // Authentication errors
    if (status === 401) {
      if (redirectOnAuth) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }
      return customMessages[401] || 'Invalid credentials'
    }

    // Authorization errors
    if (status === 403) {
      return customMessages[403] || 'You do not have permission to perform this action.'
    }

    // Not found errors
    if (status === 404) {
      return customMessages[404] || 'Backend service not found. Please ensure the backend is running on port 5026.'
    }

    // Conflict errors (e.g., email already exists)
    if (status === 409) {
      return customMessages[409] || 'Email already exists. Please use a different email or login.'
    }

    // Payment required (e.g., monthly limit exceeded)
    if (status === 402) {
      return customMessages[402] || 'Monthly limit exceeded. Please upgrade to Pro for unlimited cover letters.'
    }

    // Server errors
    if (status >= 500) {
      return customMessages[500] || 'Server error. Please try again later.'
    }

    // Other client errors
    if (status >= 400) {
      return customMessages[status] || err.response?.data?.error || err.response?.data?.message || `${operation} failed. Please try again.`
    }
  }

  // Default error message
  return err.response?.data?.error || err.response?.data?.message || `${operation} failed. Please try again.`
}

/**
 * Handle specific error types with custom logic
 * @param {Error} err - The error object
 * @param {string} operation - Description of the operation
 * @param {Object} options - Additional options
 * @returns {Object} - Object containing error message and any additional data
 */
export const handleSpecificError = (err, operation = 'API call', options = {}) => {
  // Check for specific error conditions
  if (err.response?.status === 402) {
    return {
      message: 'Monthly limit exceeded. Please upgrade to Pro for unlimited cover letters.',
      showUpgradeModal: true
    }
  }

  // Default error handling
  return {
    message: handleApiError(err, operation, options),
    showUpgradeModal: false
  }
}

/**
 * Validate API response
 * @param {Object} response - The API response
 * @returns {boolean} - Whether the response is valid
 */
export const validateApiResponse = (response) => {
  return response && response.data && response.status >= 200 && response.status < 300
} 