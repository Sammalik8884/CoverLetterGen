import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token)
        navigate('/dashboard')
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md" aria-label="Login form">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input id="email" ref={emailRef} type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" aria-required="true" aria-label="Email address" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" aria-required="true" aria-label="Password" />
        </div>
        {error && <div className="mb-4 text-red-600 dark:text-red-400" role="alert">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400" aria-busy={loading} aria-disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  )
}

export default Login 