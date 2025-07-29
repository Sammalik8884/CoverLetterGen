import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Generator from './components/Generator'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Navigation from './components/Navigation'

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('authToken')
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Router>
      <Navigation />
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generator" element={<PrivateRoute><Generator /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
