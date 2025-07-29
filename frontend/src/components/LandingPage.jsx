import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const scrollToForm = () => {
    // Navigate to generator page instead of scrolling
    window.location.href = '/generator'
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className={`py-20 px-4 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-r from-blue-600/10 to-purple-600/10'}`}></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} mb-4`}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 10,000+ job seekers
            </span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
            Generate Professional
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Cover Letters</span>
            <br />in Seconds
          </h1>
          <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
            Create compelling, personalized cover letters that stand out to employers. 
            Powered by advanced AI technology for maximum impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={scrollToForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              aria-label="Start generating cover letter"
            >
              Start Generating - It's Free
            </button>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target='_blank' className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-semibold py-4 px-8 transition-colors`}>
              Watch Demo →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-lg p-6`}>
              <div className="text-3xl font-bold text-blue-600 mb-2">30s</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Generation Time</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-lg p-6`}>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-lg p-6`}>
              <div className="text-3xl font-bold text-purple-600 mb-2">10k+</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Letters Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Why Choose CoverLetterGen?
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Advanced AI technology designed to help you land your dream job
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Lightning Fast</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Generate professional cover letters in under 30 seconds with our advanced AI technology.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>AI-Powered</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Advanced AI that understands job requirements and tailors content to your experience.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Multiple Formats</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Export as PDF, share via email, or copy to clipboard. Multiple formats for your convenience.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Secure & Private</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your data is encrypted and never shared. Your privacy is our top priority.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l1-6m-1 6l-3-1m3 1l3 9a5.002 5.002 0 01-6.001 0M18 7l-3 9m3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Freemium Model</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Start free with 3 letters per month. Upgrade to Pro for unlimited access.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Team Features</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Collaborate with your team. Add team members and share cover letters seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              What Our Users Say
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of satisfied job seekers who landed their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">S</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sarah Johnson</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Software Engineer</p>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "CoverLetterGen helped me land my dream job at Google! The AI-generated content was perfectly tailored to the position."
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">M</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mike Chen</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marketing Manager</p>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Incredible tool! Generated 5 different cover letters in minutes. Each one was unique and professional."
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">E</span>
                </div>
                <div className="ml-4">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emily Rodriguez</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>UX Designer</p>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "The tone selection feature is amazing. I can adjust the style to match different company cultures perfectly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-8 shadow-lg border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Free</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Perfect for getting started</p>
              </div>
              <ul className={`space-y-4 mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3 cover letters per month
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic tone selection
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF export
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
              <Link
                to="/generator"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-8 shadow-lg border-2 border-blue-500 relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Pro</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">$19</div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>per month</p>
              </div>
              <ul className={`space-y-4 mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited cover letters
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced tone & style options
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multilingual support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics
                </li>
              </ul>
              <button
                onClick={() => window.open('/#pricing', '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to know about CoverLetterGen
            </p>
          </div>
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                How does the AI generate cover letters?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our AI analyzes your job requirements, experience, and preferences to create personalized, professional cover letters that highlight your relevant skills and achievements.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Is my data secure?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Yes! We use enterprise-grade encryption and never share your personal information. Your data is completely private and secure.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Can I edit the generated cover letters?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Absolutely! You can copy the generated text and edit it in any word processor. We also provide a regenerate option if you want a different version.
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                What languages are supported?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We currently support English, Spanish, French, German, and Italian. More languages are coming soon!
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                How do I upgrade to Pro?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Simply click the "Upgrade to Pro" button in your dashboard or pricing page. You'll be redirected to our secure payment processor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-600'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-white'} mb-4`}>
            Ready to Land Your Dream Job?
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-blue-100'} mb-8`}>
            Join thousands of job seekers who have already used CoverLetterGen to create compelling cover letters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generator"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Start Generating Now
            </Link>
            <a
              href="#pricing"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-700 hover:bg-blue-800'} text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors`}
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-12`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.svg" alt="CoverLetterGen Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">CoverLetterGen</span>
              </div>
              <p className="text-gray-400">
                AI-powered cover letter generator helping job seekers land their dream positions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/generator" className="hover:text-white transition-colors">Generator</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CoverLetterGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 