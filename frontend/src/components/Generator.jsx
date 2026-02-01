import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getApiHeaders, API_URL } from '../utils/apiConfig'
import PaymentModal from './PaymentModal'

function Generator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    userInfo: '',
    tone: 'professional',
    experienceLevel: 'mid-level'
  })
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [analytics, setAnalytics] = useState(null)
  const [languages, setLanguages] = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const jobTitleRef = useRef(null)

  useEffect(() => {
    fetchAnalytics()
    fetchLanguages()
    // Check if user is in demo mode (no authentication)
    // We'll determine this based on the analytics response
    jobTitleRef.current?.focus()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`, {
        withCredentials: true
      })
      setAnalytics(response.data)
      setIsDemoMode(false)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setIsDemoMode(true)
    }
  }

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${API_URL}/languages`, {
        withCredentials: true
      })
      setLanguages(response.data)
    } catch (err) {
      console.error('Error fetching languages:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateCoverLetter = async () => {
    const trimmedData = {
      jobTitle: formData.jobTitle.trim(),
      companyName: formData.companyName.trim(),
      userInfo: formData.userInfo.trim(),
      tone: formData.tone,
      experienceLevel: formData.experienceLevel
    }

    if (!trimmedData.jobTitle || !trimmedData.companyName || !trimmedData.userInfo) {
      setError('Please fill in all fields')
      return
    }

    if (trimmedData.userInfo.length < 50) {
      setError('Please provide more details about your experience and skills (at least 50 characters)')
      return
    }

    // Authentication is handled by cookies, no need to check localStorage

    setLoading(true)
    setError('')

    try {
      const endpoint = selectedLanguage === 'en' ? '/generate' : `/generate/${selectedLanguage}`
      const response = await axios.post(`${API_URL}${endpoint}`, trimmedData, {
        timeout: 30000,
        withCredentials: true,
        headers: getApiHeaders(true)
      })

      if (response.data && response.data.coverLetter) {
        setCoverLetter(response.data.coverLetter)
        fetchAnalytics() // Refresh analytics after generation
        showToastMessage('Cover letter generated successfully!', 'success')
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      console.error('Error:', err)
      if (err.response?.status === 402) {
        setShowUpgradeModal(true)
        setError('Monthly limit exceeded. Please upgrade to Pro for unlimited cover letters.')
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.')
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.')
      } else if (err.response?.status === 404) {
        setError('Backend service not found. Please ensure the backend is running.')
      } else if (err.response?.status === 503) {
        setError('AI service temporarily unavailable. Please try again later.')
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.')
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate cover letter. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const regenerateCoverLetter = async () => {
    if (!coverLetter) {
      setError('No cover letter to regenerate')
      return
    }
    await generateCoverLetter()
  }

  const copyToClipboard = () => {
    if (!coverLetter) return

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(coverLetter).then(() => {
        showToastMessage('Cover letter copied to clipboard!', 'success')
      }).catch(() => {
        fallbackCopyTextToClipboard(coverLetter)
      })
    } else {
      fallbackCopyTextToClipboard(coverLetter)
    }
  }

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      showToastMessage('Cover letter copied to clipboard!', 'success')
    } catch (err) {
      showToastMessage('Failed to copy to clipboard', 'error')
    }
    document.body.removeChild(textArea)
  }

  const downloadPDF = async () => {
    if (!coverLetter) return

    try {
      // Use dynamic import for ES modules
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const splitText = doc.splitTextToSize(coverLetter, 180)
      doc.setFontSize(12)
      doc.text(splitText, 15, 20)

      doc.save('cover-letter.pdf')
      showToastMessage('PDF downloaded successfully!', 'success')
    } catch (err) {
      console.error('PDF generation failed:', err)
      showToastMessage('Failed to generate PDF', 'error')
    }
  }

  const handleUpgrade = () => {
    setShowUpgradeModal(false)
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${toastType === 'success'
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
              You've reached your monthly limit. Upgrade to Pro for unlimited cover letters, advanced features, and priority support.
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan="monthly"
      />

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
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Banner */}
        {analytics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.lettersGeneratedThisMonth}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Letters This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.plan}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Plan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.remainingLetters}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                </div>
              </div>
              {analytics.plan === 'Free' && analytics.remainingLetters <= 1 && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Generate Your Cover Letter
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a compelling cover letter in seconds with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <form className="space-y-6" aria-label="Cover letter generation form">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="jobTitle">
                  Job Title *
                </label>
                <input
                  ref={jobTitleRef}
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  aria-required="true"
                  aria-label="Job Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="e.g., Google, Microsoft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Experience & Skills *
                </label>
                <textarea
                  name="userInfo"
                  value={formData.userInfo}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  placeholder="Describe your relevant experience, skills, achievements, and why you're interested in this position..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum 50 characters. Be specific about your experience and achievements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tone
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="creative">Creative</option>
                    <option value="formal">Formal</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={generateCoverLetter}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Cover Letter'
                  )}
                </button>
                {coverLetter && (
                  <button
                    onClick={regenerateCoverLetter}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Regenerate
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" role="alert">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </form>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generated Cover Letter
                </h3>
                {coverLetter && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 min-h-[400px] border border-gray-200 dark:border-gray-600">
                {coverLetter ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                      {coverLetter}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>Your cover letter will appear here</p>
                      <p className="text-sm">Fill in the form and click "Generate Cover Letter"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Generator 