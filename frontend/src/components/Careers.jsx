import { useState } from 'react'
import { Link } from 'react-router-dom'

function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'product', name: 'Product' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'operations', name: 'Operations' }
  ]

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      department: "engineering",
      location: "Remote / San Francisco, CA",
      type: "Full-time",
      experience: "5+ years",
      description: "We're looking for a Senior Full-Stack Developer to join our engineering team and help build the next generation of AI-powered job application tools.",
      requirements: [
        "Strong experience with React, Node.js, and .NET",
        "Experience with AI/ML technologies and APIs",
        "Knowledge of cloud platforms (AWS/Azure)",
        "Experience with database design and optimization",
        "Strong problem-solving and communication skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible remote work policy",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "Unlimited PTO"
      ]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "product",
      location: "Remote / New York, NY",
      type: "Full-time",
      experience: "3+ years",
      description: "Join our product team to help shape the future of job application tools and create exceptional user experiences.",
      requirements: [
        "Experience in B2B SaaS product management",
        "Strong analytical and data-driven decision making",
        "Experience with user research and UX design",
        "Knowledge of AI/ML products and market",
        "Excellent communication and leadership skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible remote work policy",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "Unlimited PTO"
      ]
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "marketing",
      location: "Remote / Austin, TX",
      type: "Full-time",
      experience: "4+ years",
      description: "Help us grow our brand and reach more job seekers who need our AI-powered cover letter tools.",
      requirements: [
        "Experience in digital marketing and growth",
        "Knowledge of SEO, SEM, and social media",
        "Experience with marketing automation tools",
        "Strong analytical skills and data-driven approach",
        "Creative thinking and content creation skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible remote work policy",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "Unlimited PTO"
      ]
    },
    {
      id: 4,
      title: "AI/ML Engineer",
      department: "engineering",
      location: "Remote / Seattle, WA",
      type: "Full-time",
      experience: "3+ years",
      description: "Work on cutting-edge AI models to improve our cover letter generation capabilities and user experience.",
      requirements: [
        "Strong background in machine learning and NLP",
        "Experience with Python, TensorFlow, and PyTorch",
        "Knowledge of transformer models and fine-tuning",
        "Experience with cloud ML platforms",
        "Strong research and experimentation skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible remote work policy",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "Unlimited PTO"
      ]
    },
    {
      id: 5,
      title: "Customer Success Manager",
      department: "operations",
      location: "Remote / Chicago, IL",
      type: "Full-time",
      experience: "2+ years",
      description: "Help our users succeed with our platform and build strong relationships with our customer base.",
      requirements: [
        "Experience in customer success or account management",
        "Strong communication and problem-solving skills",
        "Experience with CRM systems and analytics",
        "Knowledge of SaaS business models",
        "Empathy and customer-focused mindset"
      ],
      benefits: [
        "Competitive salary and equity",
        "Flexible remote work policy",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "Unlimited PTO"
      ]
    }
  ]

  const filteredJobs = jobOpenings.filter(job => 
    selectedDepartment === 'all' || job.department === selectedDepartment
  )

  const cultureValues = [
    {
      title: "Innovation First",
      description: "We're constantly pushing the boundaries of what's possible with AI and technology.",
      icon: "🚀"
    },
    {
      title: "User-Centric",
      description: "Every decision we make is driven by how it will help our users succeed in their careers.",
      icon: "❤️"
    },
    {
      title: "Remote-First",
      description: "We believe great work can happen anywhere, and we support flexible work arrangements.",
      icon: "🌍"
    },
    {
      title: "Continuous Learning",
      description: "We invest in our team's growth with learning budgets and development opportunities.",
      icon: "📚"
    }
  ]

  const perks = [
    "Competitive salary and equity packages",
    "Flexible remote work policy",
    "Health, dental, and vision insurance",
    "Professional development budget",
    "Unlimited PTO and flexible hours",
    "Home office setup allowance",
    "Regular team events and retreats",
    "Mental health and wellness programs",
    "401(k) matching",
    "Parental leave and family support"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Help us revolutionize how people approach job applications. We're building the future 
            of AI-powered career tools, and we need passionate people to join our mission.
          </p>
        </div>

        {/* Culture Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Culture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Perks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Perks & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-0">
              Open Positions
            </h2>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedDepartment === dept.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No positions available in this department at the moment
              </p>
              <p className="text-gray-400 dark:text-gray-500">
                Check back soon or send us your resume for future opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to="/contact"
                      className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Now
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Don't See the Right Role?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume 
            and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Send Your Resume
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a 
              href="mailto:careers@coverlettergen.com"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Email Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers 