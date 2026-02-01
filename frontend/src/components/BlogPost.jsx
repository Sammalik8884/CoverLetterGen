import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Elements Every Cover Letter Must Include",
      excerpt: "Learn the fundamental components that make a cover letter stand out to hiring managers and increase your chances of landing an interview.",
      content: `
        <p>A compelling cover letter can be the difference between getting an interview and being overlooked. In today's competitive job market, it's essential to include specific elements that showcase your qualifications and enthusiasm for the position. This comprehensive guide covers everything from proper formatting to compelling storytelling techniques that will make your application memorable.</p>

        <h2>1. Professional Header and Contact Information</h2>
        <p>Your cover letter should begin with a professional header that includes your name, address, phone number, and email address. This information should match what's on your resume for consistency. Include the date and the hiring manager's name and title if possible.</p>
        <p><strong>Example:</strong></p>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
          <p>Sarah Johnson<br/>
          123 Main Street<br/>
          City, State 12345<br/>
          (555) 123-4567<br/>
          sarah.johnson@email.com</p>
        </div>

        <h2>2. Compelling Opening Paragraph</h2>
        <p>The first paragraph should immediately grab the reader's attention and clearly state the position you're applying for. Mention how you learned about the opportunity and express your enthusiasm for the role.</p>
        <p><strong>Key elements:</strong></p>
        <ul>
          <li>Position title and company name</li>
          <li>How you found the opportunity</li>
          <li>Your enthusiasm for the role</li>
          <li>A brief hook that makes them want to read more</li>
        </ul>

        <h2>3. Relevant Experience and Achievements</h2>
        <p>The body of your cover letter should highlight your most relevant experience and achievements. Don't just repeat your resume – tell a story about how your background makes you the perfect candidate for this specific role.</p>
        <p><strong>Tips for this section:</strong></p>
        <ul>
          <li>Use specific examples and quantifiable results</li>
          <li>Connect your experience to the job requirements</li>
          <li>Show how you've solved similar problems</li>
          <li>Demonstrate your understanding of the company's needs</li>
        </ul>

        <h2>4. Company Research and Cultural Fit</h2>
        <p>Show that you've done your homework by mentioning specific details about the company, its values, recent news, or projects. This demonstrates genuine interest and helps you connect your background to their mission.</p>

        <h2>5. Skills and Qualifications Alignment</h2>
        <p>Clearly connect your skills and qualifications to the job requirements. Use the same language from the job posting when possible, but don't just list skills – explain how you've used them successfully.</p>

        <h2>6. Enthusiasm and Motivation</h2>
        <p>Express genuine enthusiasm for the opportunity and explain why you're excited about this specific role and company. This helps hiring managers understand your motivation and commitment.</p>

        <h2>7. Call to Action</h2>
        <p>End with a strong call to action that invites the hiring manager to contact you for an interview. Be confident but not pushy.</p>
        <p><strong>Example:</strong></p>
        <p>"I would welcome the opportunity to discuss how my background, skills, and enthusiasm would make me a valuable addition to your team. I'm available for an interview at your convenience and look forward to hearing from you."</p>

        <h2>8. Professional Closing</h2>
        <p>Use a professional closing such as "Sincerely," "Best regards," or "Thank you for your consideration." Sign your name and include your contact information again if sending a hard copy.</p>

        <h2>9. Proper Formatting and Length</h2>
        <p>Keep your cover letter to one page (about 300-400 words) and use professional formatting. Use a standard font like Arial or Times New Roman, 11-12 point size, with 1-inch margins.</p>

        <h2>10. Proofreading and Polish</h2>
        <p>Before sending, carefully proofread your cover letter for grammar, spelling, and punctuation errors. Consider having someone else review it as well. A polished, error-free cover letter shows attention to detail and professionalism.</p>

        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li><strong>Generic content:</strong> Don't use the same cover letter for every application</li>
          <li><strong>Focusing too much on yourself:</strong> Emphasize what you can do for the company</li>
          <li><strong>Being too formal or stiff:</strong> Show personality while maintaining professionalism</li>
          <li><strong>Including irrelevant information:</strong> Focus on what's relevant to the specific role</li>
          <li><strong>Making it too long:</strong> Keep it concise and focused</li>
        </ul>

        <h2>Final Tips</h2>
        <p>Remember that your cover letter is your opportunity to tell your story and connect with the hiring manager on a personal level. Use it to showcase not just what you've done, but who you are and why you're passionate about this opportunity.</p>
        <p>By including these essential elements and avoiding common mistakes, you'll create a cover letter that stands out and increases your chances of landing an interview.</p>
      `,
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
      content: `
        <p>Artificial intelligence has fundamentally changed how job seekers approach the application process. From automated resume screening to AI-powered cover letter generation, technology is making it easier than ever to create professional, personalized applications. This article explores the latest AI tools and how they're leveling the playing field for candidates.</p>

        <h2>The Rise of AI in Job Applications</h2>
        <p>In recent years, artificial intelligence has become increasingly prevalent in the job application process. Both employers and job seekers are leveraging AI tools to streamline and improve their workflows. For job seekers, this means access to powerful tools that can help create more compelling applications.</p>

        <h2>AI-Powered Cover Letter Generation</h2>
        <p>One of the most significant developments is AI-powered cover letter generation. These tools analyze job descriptions, your resume, and your experience to create personalized cover letters that highlight the most relevant qualifications for each position.</p>
        <p><strong>Benefits of AI-generated cover letters:</strong></p>
        <ul>
          <li>Personalized content based on job requirements</li>
          <li>Consistent quality and professional tone</li>
          <li>Time-saving for busy professionals</li>
          <li>Improved keyword optimization for ATS systems</li>
        </ul>

        <h2>Resume Optimization with AI</h2>
        <p>AI tools can also help optimize resumes for Applicant Tracking Systems (ATS) by analyzing job descriptions and suggesting relevant keywords and phrases. This increases the chances of your resume being seen by human recruiters.</p>

        <h2>Interview Preparation</h2>
        <p>AI-powered interview preparation tools can help candidates practice common questions, receive feedback on their responses, and improve their communication skills. These tools use natural language processing to analyze speech patterns and provide constructive feedback.</p>

        <h2>The Future of AI in Job Applications</h2>
        <p>As AI technology continues to evolve, we can expect even more sophisticated tools that will further streamline the job application process. However, it's important to remember that AI should be used as a tool to enhance human capabilities, not replace them entirely.</p>
      `,
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
      content: `
        <p>Networking has evolved significantly with the rise of digital platforms. LinkedIn, Twitter, and professional communities have created new opportunities to connect with industry leaders and potential employers. This guide provides practical strategies for building meaningful professional relationships online and leveraging them for career growth.</p>

        <h2>Building Your Online Presence</h2>
        <p>Your online presence is often the first impression potential connections will have of you. It's essential to maintain a professional and consistent image across all platforms.</p>

        <h2>Leveraging LinkedIn Effectively</h2>
        <p>LinkedIn remains the premier platform for professional networking. Here's how to use it effectively:</p>
        <ul>
          <li>Optimize your profile with relevant keywords</li>
          <li>Share valuable content regularly</li>
          <li>Engage with others' posts thoughtfully</li>
          <li>Join and participate in relevant groups</li>
        </ul>

        <h2>Virtual Networking Events</h2>
        <p>With the rise of remote work, virtual networking events have become increasingly popular. These events offer unique opportunities to connect with professionals from around the world.</p>
      `,
      author: "Emily Rodriguez",
      date: "2024-01-10",
      category: "career-advice",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    }
  ]

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(id))
    setPost(foundPost)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Blog
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {post.readTime}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CoverLetterGen Team
                </p>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{relatedPost.author}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
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

export default BlogPost 