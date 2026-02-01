import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { API_URL } from '../utils/apiConfig'

function PaymentModal({ isOpen, onClose, plan = 'monthly' }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plans = {
    monthly: {
      name: 'Pro Monthly',
      price: '$9.99',
      period: 'month',
      description: 'Unlimited cover letters, advanced features, priority support',
      gumroadUrl: 'https://coverlettergen.gumroad.com/l/attsz'
    },
    annual: {
      name: 'Pro Annual',
      price: '$99',
      period: 'year',
      description: 'Unlimited cover letters, advanced features, priority support (Save 17%)',
      gumroadUrl: 'https://coverlettergen.gumroad.com/l/rrcdhp'
    }
  }

  const [selectedPlanType, setSelectedPlanType] = useState(plan)
  const selectedPlan = plans[selectedPlanType]

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Open Gumroad checkout in a new window
      const checkoutWindow = window.open(
        selectedPlan.gumroadUrl,
        'gumroad-checkout',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for messages from Gumroad
      const handleMessage = (event) => {
        if (event.origin !== 'https://gumroad.com') return

        if (event.data.type === 'gumroad:checkout:completed') {
          // Payment completed successfully
          checkoutWindow.close()
          onClose()

          // Wait a moment for webhook to process, then check status
          setTimeout(async () => {
            try {
              const response = await fetch(`${API_URL}/auth/validate`, {
                credentials: 'include'
              })

              if (response.ok) {
                const data = await response.json()
                if (data.valid && data.user && data.user.isPro) {
                  // Show success message and redirect
                  alert('Payment successful! You now have Pro access.')
                  window.location.href = '/dashboard'
                } else {
                  // Payment might still be processing
                  alert('Payment completed! Please refresh the page to see your Pro status.')
                  window.location.reload()
                }
              } else {
                alert('Payment completed! Please refresh the page to see your Pro status.')
                window.location.reload()
              }
            } catch (err) {
              console.error('Error checking payment status:', err)
              alert('Payment completed! Please refresh the page to see your Pro status.')
              window.location.reload()
            }
          }, 3000) // Wait 3 seconds for webhook to process
        } else if (event.data.type === 'gumroad:checkout:cancelled') {
          // Payment was cancelled
          checkoutWindow.close()
          setError('Payment was cancelled')
        }
      }

      window.addEventListener('message', handleMessage)

      // Cleanup listener after 5 minutes
      setTimeout(() => {
        window.removeEventListener('message', handleMessage)
      }, 300000)

    } catch (err) {
      setError('Failed to open payment window. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upgrade to Pro
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setSelectedPlanType('monthly')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${selectedPlanType === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlanType('annual')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${selectedPlanType === 'annual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Annual
              </button>
            </div>

            {/* Plan Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {selectedPlan.price}
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    /{selectedPlan.period}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {selectedPlan.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited cover letter generation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics & insights
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority customer support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cover letter templates
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email sharing & collaboration
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                `Upgrade to ${selectedPlan.name}`
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Secure payment powered by Gumroad. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal 