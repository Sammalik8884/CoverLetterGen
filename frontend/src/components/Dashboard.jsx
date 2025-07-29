import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const [coverLetters, setCoverLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    fetchCoverLetters()
    fetchAnalytics()
    // Check if user is in demo mode (no auth token)
    const token = localStorage.getItem('authToken')
    setIsDemoMode(!token)
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCoverLetters = async () => {
    try {
      const response = await axios.get(`${API_URL}/coverletters`)
      setCoverLetters(response.data)
    } catch (err) {
      setError('Failed to load cover letters')
      console.error('Error fetching cover letters:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`)
      setAnalytics(response.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    }
  }

  const deleteCoverLetter = async (id) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return

    try {
      await axios.delete(`${API_URL}/coverletters/${id}`)
      setCoverLetters(coverLetters.filter(letter => letter.id !== id))
      fetchAnalytics() // Refresh analytics
      showToastMessage('Cover letter deleted successfully!', 'success')
    } catch (err) {
      setError('Failed to delete cover letter')
      console.error('Error deleting cover letter:', err)
    }
  }

  const downloadPDF = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/coverletters/${id}/pdf`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `cover-letter-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      showToastMessage('PDF downloaded successfully!', 'success')
    } catch (err) {
      setError('Failed to download PDF')
      console.error('Error downloading PDF:', err)
    }
  }

  const shareCoverLetter = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/coverletters/${id}/share`)
      const shareUrl = response.data.shareUrl
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      showToastMessage('Share link copied to clipboard!', 'success')
    } catch (err) {
      setError('Failed to generate share link')
      console.error('Error sharing cover letter:', err)
    }
  }

  const sendEmail = async (id) => {
    try {
      const recipientEmail = prompt('Enter recipient email address:')
      if (!recipientEmail) return

      await axios.post(`${API_URL}/coverletters/${id}/send-email`, {
        recipientEmail
      })
      showToastMessage('Cover letter sent successfully!', 'success')
    } catch (err) {
      setError('Failed to send email')
      console.error('Error sending email:', err)
    }
  }

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleUpgrade = () => {
    // Redirect to pricing or upgrade page
    window.open('/#pricing', '_blank')
    setShowUpgradeModal(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getToneColor = (tone) => {
    const colors = {
      'professional': 'bg-blue-100 text-blue-800',
      'friendly': 'bg-green-100 text-green-800',
      'creative': 'bg-purple-100 text-purple-800',
      'formal': 'bg-gray-100 text-gray-800',
      'enthusiastic': 'bg-orange-100 text-orange-800'
    }
    return colors[tone] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" role="status" aria-live="polite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" aria-label="Loading"></div>
            <span className="text-lg text-gray-600 dark:text-gray-400">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`} role="alert" aria-live="assertive">
          {toastMessage}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Upgrade to Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Unlock unlimited cover letters, advanced analytics, team features, and priority support.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleUpgrade}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="CoverLetterGen Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">CoverLetterGen</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/generator" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Generator
              </Link>
              {isDemoMode && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Section */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Letters</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalLetters}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.lettersGeneratedThisMonth}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.plan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.remainingLetters}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Banner */}
        {analytics && analytics.plan === 'Free' && analytics.remainingLetters <= 1 && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100">Get unlimited cover letters, advanced features, and priority support.</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Cover Letters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cover Letters</h2>
              <Link
                to="/generator"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Generate New
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800" role="alert">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {coverLetters.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No cover letters yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Generate your first cover letter to get started</p>
              <Link
                to="/generator"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Generate Your First Letter
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {coverLetters.map((letter) => (
                <div key={letter.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {letter.title || `Cover Letter for ${letter.jobTitle}`}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(letter.tone)}`}>
                          {letter.tone}
                        </span>
                        {letter.language && letter.language !== 'en' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {letter.language.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {letter.jobTitle} at {letter.companyName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Generated on {formatDate(letter.createdAt)}
                      </p>
                      {letter.tokensUsed && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Tokens used: {letter.tokensUsed}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLetter(letter)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => downloadPDF(letter.id)}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => shareCoverLetter(letter.id)}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => sendEmail(letter.id)}
                        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => deleteCoverLetter(letter.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedLetter.title || `Cover Letter for ${selectedLetter.jobTitle}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedLetter.content}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Generated on {formatDate(selectedLetter.createdAt)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadPDF(selectedLetter.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedLetter.content)
                    showToastMessage('Cover letter copied to clipboard!', 'success')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Copy Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 