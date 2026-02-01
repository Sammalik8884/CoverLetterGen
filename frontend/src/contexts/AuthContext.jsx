import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { handleApiError } from '../utils/errorHandler'
import { API_URL, getApiHeaders } from '../utils/apiConfig'

const AuthContext = createContext()

export { AuthContext }
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/validate`, {
          withCredentials: true // Important for cookies
        })

        if (response.data.valid) {
          setIsAuthenticated(true)
          setUser(response.data.user)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (err) {
        console.error('Auth validation failed:', err)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError('')

    try {
      // Add a minimum delay to prevent rapid-fire requests and improve UX
      const minDelay = new Promise(resolve => setTimeout(resolve, 800))

      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        withCredentials: true, // Important for cookies
        headers: getApiHeaders(false),
        timeout: 5000 // 5 second timeout
      })

      // Wait for minimum delay
      await minDelay

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.user)
        return { success: true }
      } else {
        setError('Invalid response from server')
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (err) {
      // Wait for minimum delay even on error
      await new Promise(resolve => setTimeout(resolve, 800))

      let errorMessage = 'Login failed. Please try again.'

      if (err.response?.status === 401) {
        errorMessage = 'Invalid credentials'
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again in a few moments.'
      } else {
        errorMessage = handleApiError(err, 'Login', {
          customMessages: {
            401: 'Invalid credentials'
          }
        })
      }

      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true, // Important for cookies
        headers: getApiHeaders(false)
      })

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.user)
        return { success: true }
      } else {
        setError('Invalid response from server')
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (err) {
      const errorMessage = handleApiError(err, 'Registration', {
        customMessages: {
          409: 'Email already exists. Please use a different email or login.'
        }
      })
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      setError('')
    }
  }

  const clearError = () => {
    setError('')
  }

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      return { success: true, message: 'Check your email for reset instructions.' }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to send reset email.' }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword: newPassword })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to reset password.' }
    }
  }

  const googleLogin = async (credential) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { credential }, {
        withCredentials: true
      })
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.user)
        return { success: true }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed')
      return { success: false, error: err.response?.data?.error }
    } finally {
      setLoading(false)
    }
  }


  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    forgotPassword,
    resetPassword,
    googleLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 