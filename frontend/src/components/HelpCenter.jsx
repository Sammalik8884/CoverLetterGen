import { useState } from 'react'
import { Link } from 'react-router-dom'

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')

  const faqData = {
    'getting-started': [
      {
        question: "How do I create my first cover letter?",
        answer: "To create your first cover letter, simply sign up for an account, navigate to the Generator page, and fill out the form with your job details. Our AI will generate a personalized cover letter for you."
      },
      {
        question: "What information do I need to provide?",
        answer: "You'll need to provide: your name, the company name, job title, job description, your relevant experience, and any specific requirements mentioned in the job posting."
      },
      {
        question: "How long does it take to generate a cover letter?",
        answer: "Our AI typically generates a cover letter within 30-60 seconds. The time may vary depending on the complexity of the job requirements and the amount of information provided."
      },
      {
        question: "Can I edit the generated cover letter?",
        answer: "Yes! After generation, you can edit any part of the cover letter to better match your voice and preferences. All changes are saved automatically."
      }
    ],
    'account': [
      {
        question: "How do I reset my password?",
        answer: "Click on the 'Forgot Password' link on the login page. Enter your email address and we'll send you a password reset link."
      },
      {
        question: "Can I change my email address?",
        answer: "Yes, you can update your email address in your account settings. Go to your Dashboard and click on 'Account Settings' to make changes."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, please contact our support team at support@coverlettergen.com. We'll process your request within 48 hours."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties."
      }
    ],
    'billing': [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through Stripe."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact us within 30 days of your purchase for a full refund."
      },
      {
        question: "How do I update my billing information?",
        answer: "You can update your billing information in your account settings under the 'Billing' section. Changes take effect immediately."
      }
    ],
    'technical': [
      {
        question: "What browsers are supported?",
        answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome."
      },
      {
        question: "The page isn't loading properly. What should I do?",
        answer: "Try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or contact our support team."
      },
      {
        question: "Can I use the service on mobile devices?",
        answer: "Yes! Our website is fully responsive and works great on mobile devices, tablets, and desktop computers."
      },
      {
        question: "How do I download my cover letter?",
        answer: "After generating your cover letter, you can download it as a PDF or Word document by clicking the 'Download' button in the editor."
      }
    ]
  }

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Settings', icon: '👤' },
    { id: 'billing', name: 'Billing & Payments', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' }
  ]

  const filteredFAQs = faqData[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and get the support you need to create amazing cover letters.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeCategory === category.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {categories.find(cat => cat.id === activeCategory)?.name}
              </h2>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-gray-400 dark:text-gray-500">
                    Try searching with different keywords or browse our categories.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Still Need Help Section */}
            <div className="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  Still need help?
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Our support team is here to help you with any questions or issues you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Contact Support
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a 
                    href="mailto:support@coverlettergen.com"
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    Send Email
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter 