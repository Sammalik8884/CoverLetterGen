import { Link } from 'react-router-dom'

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
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
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  By accessing and using CoverLetterGen ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our website and services operated by CoverLetterGen ("Company," "we," "us," or "our").
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Description of Service
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  CoverLetterGen provides AI-powered cover letter generation services. Our platform uses artificial intelligence to help users create personalized cover letters based on job requirements and user-provided information.
                </p>
                <p>
                  The Service includes:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>AI-powered cover letter generation</li>
                  <li>Cover letter editing and customization tools</li>
                  <li>Template library and examples</li>
                  <li>User account management</li>
                  <li>Customer support services</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  To access certain features of our Service, you may be required to create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information during registration</li>
                  <li>Updating your account information as necessary</li>
                </ul>
                <p>
                  You must be at least 18 years old to create an account and use our Service. By creating an account, you represent and warrant that you meet this age requirement.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use the Service to generate content that is harmful, offensive, or inappropriate</li>
                  <li>Share your account credentials with others</li>
                  <li>Use automated systems to access the Service</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of CoverLetterGen and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
                <p>
                  You retain ownership of the content you create using our Service. However, by using our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content solely for the purpose of providing the Service.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Payment Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Some features of our Service may require payment. By purchasing a subscription or using paid features, you agree to pay all fees associated with your use of the Service.
                </p>
                <p>
                  Payment terms:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We may change our pricing with 30 days' notice</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You may cancel your subscription at any time</li>
                  <li>We use third-party payment processors for secure transactions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  By using our Service, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Disclaimers and Limitations
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  We do not guarantee that:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>The Service will be uninterrupted or error-free</li>
                  <li>Generated cover letters will result in job offers</li>
                  <li>The Service will meet your specific requirements</li>
                  <li>Any errors will be corrected</li>
                </ul>
                <p>
                  IN NO EVENT SHALL COVERLETTERGEN BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Termination
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
                </p>
                <p>
                  Upon termination:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Your right to use the Service will cease immediately</li>
                  <li>We may delete your account and data</li>
                  <li>Any provisions of these Terms that should survive termination will remain in effect</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Governing Law
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which CoverLetterGen operates, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of the Service after any changes constitutes acceptance of the new Terms. If you do not agree to the new Terms, you should discontinue using the Service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:legal@coverlettergen.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@coverlettergen.com</a></p>
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
            Questions about our terms?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're committed to transparency and clear communication. If you have any questions about our terms of service, we're here to help.
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
              href="mailto:legal@coverlettergen.com"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Email Legal Team
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

export default TermsOfService 