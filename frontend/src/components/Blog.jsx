import { useState } from 'react'
import { Link } from 'react-router-dom'

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'cover-letters', name: 'Cover Letters' },
    { id: 'job-search', name: 'Job Search' },
    { id: 'career-advice', name: 'Career Advice' },
    { id: 'ai-tools', name: 'AI Tools' }
  ]

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Elements Every Cover Letter Must Include",
      excerpt: "Learn the fundamental components that make a cover letter stand out to hiring managers and increase your chances of landing an interview.",
      content: "A compelling cover letter can be the difference between getting an interview and being overlooked. In today's competitive job market, it's essential to include specific elements that showcase your qualifications and enthusiasm for the position. This comprehensive guide covers everything from proper formatting to compelling storytelling techniques that will make your application memorable.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "cover-letters",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "How AI is Revolutionizing the Job Application Process",
      excerpt: "Discover how artificial intelligence is transforming the way we write cover letters and prepare for job interviews.",
      content: "Artificial intelligence has fundamentally changed how job seekers approach the application process. From automated resume screening to AI-powered cover letter generation, technology is making it easier than ever to create professional, personalized applications. This article explores the latest AI tools and how they're leveling the playing field for candidates.",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "ai-tools",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 3,
      title: "The Ultimate Guide to Networking in the Digital Age",
      excerpt: "Master the art of professional networking using social media, virtual events, and online platforms to advance your career.",
      content: "Networking has evolved significantly with the rise of digital platforms. LinkedIn, Twitter, and professional communities have created new opportunities to connect with industry leaders and potential employers. This guide provides practical strategies for building meaningful professional relationships online and leveraging them for career growth.",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      category: "career-advice",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Common Cover Letter Mistakes That Could Cost You the Job",
      excerpt: "Avoid these critical errors that hiring managers see all too often and learn how to make your cover letter truly exceptional.",
      content: "Even experienced professionals make common mistakes in their cover letters that can immediately disqualify them from consideration. From generic templates to poor formatting, this article identifies the most frequent errors and provides specific guidance on how to avoid them while creating compelling, personalized content.",
      author: "David Kim",
      date: "2024-01-08",
      category: "cover-letters",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Remote Work: How to Adapt Your Job Search Strategy",
      excerpt: "Navigate the new world of remote work opportunities and learn how to position yourself for success in virtual environments.",
      content: "The pandemic has permanently changed the job market, with remote work becoming a standard option for many positions. This comprehensive guide helps job seekers understand how to adapt their search strategy, highlight remote work skills, and prepare for virtual interviews in this evolving landscape.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      category: "job-search",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Industry-Specific Cover Letter Templates That Work",
      excerpt: "Get access to proven cover letter templates for different industries and learn how to customize them effectively.",
      content: "Different industries have unique expectations and preferences when it comes to cover letters. This article provides industry-specific templates and guidance for technology, healthcare, finance, marketing, and other major sectors, helping you create targeted applications that resonate with hiring managers in your field.",
      author: "Emily Rodriguez",
      date: "2024-01-03",
      category: "cover-letters",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      title: "The Psychology Behind Successful Job Applications",
      excerpt: "Understand what hiring managers are really looking for and how to appeal to their decision-making process.",
      content: "Successful job applications are built on understanding human psychology and decision-making processes. This article delves into the cognitive biases and psychological factors that influence hiring decisions, providing insights that can help you craft more persuasive applications and interview responses.",
      author: "Michael Chen",
      date: "2023-12-28",
      category: "career-advice",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop"
    },
    {
      id: 8,
      title: "Building a Personal Brand That Attracts Opportunities",
      excerpt: "Learn how to develop and maintain a professional personal brand that opens doors to new career opportunities.",
      content: "In today's digital world, your personal brand is often the first impression potential employers have of you. This guide covers everything from social media presence to thought leadership, helping you build a compelling personal brand that attracts opportunities and positions you as an industry expert.",
      author: "David Kim",
      date: "2023-12-25",
      category: "career-advice",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      id: 9,
      title: "Automating Your Job Search: Tools and Strategies",
      excerpt: "Discover the best automation tools and strategies to streamline your job search and save valuable time.",
      content: "Job searching can be time-consuming, but automation tools can help you work smarter, not harder. This article reviews the best job search automation tools, from resume parsers to interview schedulers, and provides strategies for implementing them effectively in your job search process.",
      author: "Sarah Johnson",
      date: "2023-12-22",
      category: "ai-tools",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
    {
      id: 10,
      title: "The Future of Hiring: AI and Machine Learning Trends",
      excerpt: "Explore how AI and machine learning are shaping the future of recruitment and what it means for job seekers.",
      content: "The recruitment industry is undergoing a technological revolution, with AI and machine learning playing increasingly important roles. This forward-looking article examines current trends and predicts how these technologies will continue to evolve, helping job seekers prepare for the future of hiring.",
      author: "Michael Chen",
      date: "2023-12-20",
      category: "ai-tools",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop"
    },
    {
      id: 11,
      title: "Salary Negotiation: Strategies for Getting What You're Worth",
      excerpt: "Master the art of salary negotiation with proven strategies and techniques that can significantly increase your compensation.",
      content: "Salary negotiation is one of the most important skills for career advancement, yet many professionals avoid it due to fear or lack of preparation. This comprehensive guide provides practical strategies, scripts, and psychological techniques to help you negotiate confidently and secure the compensation you deserve.",
      author: "Emily Rodriguez",
      date: "2023-12-18",
      category: "career-advice",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1554224154-26032cdc0c0f?w=400&h=250&fit=crop"
    },
    {
      id: 12,
      title: "Cover Letter vs. Resume: Understanding the Key Differences",
      excerpt: "Learn the distinct purposes of cover letters and resumes and how to make them work together effectively.",
      content: "While resumes and cover letters are both essential components of job applications, they serve different purposes and require different approaches. This article clarifies the key differences and provides guidance on how to create complementary documents that work together to tell your complete professional story.",
      author: "David Kim",
      date: "2023-12-15",
      category: "cover-letters",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop"
    },
    {
      id: 13,
      title: "Job Search During Economic Uncertainty: A Survival Guide",
      excerpt: "Navigate job searching during challenging economic times with proven strategies and resilience-building techniques.",
      content: "Economic uncertainty can make job searching particularly challenging, but it also creates unique opportunities for those who know how to adapt. This survival guide provides practical strategies for maintaining momentum, identifying hidden opportunities, and building resilience during difficult economic periods.",
      author: "Sarah Johnson",
      date: "2023-12-12",
      category: "job-search",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop"
    },
    {
      id: 14,
      title: "The Rise of Skills-Based Hiring: What You Need to Know",
      excerpt: "Understand the shift toward skills-based hiring and how to position yourself for success in this new paradigm.",
      content: "Traditional hiring based on degrees and experience is giving way to skills-based hiring, which focuses on actual capabilities and potential. This article explains this shift and provides strategies for showcasing your skills effectively, regardless of your educational background or work history.",
      author: "Michael Chen",
      date: "2023-12-10",
      category: "career-advice",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
      id: 15,
      title: "Creating a Portfolio That Showcases Your Value",
      excerpt: "Build a compelling professional portfolio that demonstrates your skills and achievements to potential employers.",
      content: "A well-crafted portfolio can be a powerful tool for showcasing your work and demonstrating your value to potential employers. This guide covers everything from choosing the right platform to selecting and presenting your best work, helping you create a portfolio that stands out in a competitive market.",
      author: "Emily Rodriguez",
      date: "2023-12-08",
      category: "career-advice",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CoverLetterGen Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expert insights, tips, and strategies to help you succeed in your job search and career.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Articles
            </h2>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {featuredPosts.map((post) => (
                 <Link 
                   key={post.id}
                   to={`/blog/${post.id}`}
                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                 >
                   <img 
                     src={post.image} 
                     alt={post.title}
                     className="w-full h-48 object-cover"
                   />
                   <div className="p-6">
                     <div className="flex items-center gap-4 mb-3">
                       <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                         {categories.find(cat => cat.id === post.category)?.name}
                       </span>
                       <span className="text-gray-500 dark:text-gray-400 text-sm">
                         {post.readTime}
                       </span>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                       {post.title}
                     </h3>
                     <p className="text-gray-600 dark:text-gray-300 mb-4">
                       {post.excerpt}
                     </p>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           {post.author}
                         </span>
                       </div>
                       <span className="text-sm text-gray-500 dark:text-gray-400">
                         {new Date(post.date).toLocaleDateString()}
                       </span>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Articles
          </h2>
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No articles found matching your criteria
              </p>
            </div>
          ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {regularPosts.map((post) => (
                 <Link 
                   key={post.id}
                   to={`/blog/${post.id}`}
                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                 >
                   <img 
                     src={post.image} 
                     alt={post.title}
                     className="w-full h-48 object-cover"
                   />
                   <div className="p-6">
                     <div className="flex items-center gap-4 mb-3">
                       <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                         {categories.find(cat => cat.id === post.category)?.name}
                       </span>
                       <span className="text-gray-500 dark:text-gray-400 text-sm">
                         {post.readTime}
                       </span>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                       {post.title}
                     </h3>
                     <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                       {post.excerpt}
                     </p>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           {post.author}
                         </span>
                       </div>
                       <span className="text-sm text-gray-500 dark:text-gray-400">
                         {new Date(post.date).toLocaleDateString()}
                       </span>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Stay Updated with Career Insights
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest job search tips, cover letter advice, and career strategies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog 