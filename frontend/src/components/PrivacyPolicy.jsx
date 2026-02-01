import { Link } from 'react-router-dom'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Personal Information</h3>
                  <p>When you create an account or use our services, we may collect:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Name and email address</li>
                    <li>Account credentials</li>
                    <li>Profile information</li>
                    <li>Cover letter content and job details</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Usage Information</h3>
                  <p>We automatically collect certain information about your use of our services:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Error logs and performance data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide and improve our cover letter generation services</li>
                  <li>Process payments and manage your account</li>
                  <li>Send important updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform (payment processors, hosting providers, etc.)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Your Rights and Choices
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where applicable</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@coverlettergen.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    privacy@coverlettergen.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="mt-4">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>We retain your personal information for as long as necessary to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services</li>
                </ul>
                <p className="mt-4">
                  When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. International Data Transfers
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Children's Privacy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Contact Us
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:privacy@coverlettergen.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@coverlettergen.com</a></p>
                    <p><strong>Support:</strong> <a href="mailto:support@coverlettergen.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@coverlettergen.com</a></p>
                    <p><strong>Contact Form:</strong> <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Us</Link></p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Questions about your privacy?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're committed to protecting your privacy and being transparent about how we handle your data. If you have any concerns, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a 
              href="mailto:privacy@coverlettergen.com"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Email Privacy Team
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

export default PrivacyPolicy 