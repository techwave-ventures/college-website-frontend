// Suggested file path: app/terms-of-service/page.jsx (for App Router)
// Or: pages/terms-of-service.jsx (for Pages Router)

import React from 'react';
import Navbar from "../_components/Navbar"; // Adjust path if needed relative to this file
import Footer from "../_components/Footer"; // Adjust path if needed relative to this file

export default function TermsOfServicePage() {
  // **IMPORTANT**: Replace all placeholder text below with your actual Terms of Service.
  // Consult with a legal professional.

  const lastUpdatedDate = "April 28, 2025"; // *** UPDATE THIS DATE WHEN TERMS CHANGE ***

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Added background */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg"> {/* Enhanced card styling */}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-4">
            Terms of Service
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {lastUpdatedDate}
          </p>

          {/* Introduction / Acceptance */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Campus Sathi ("Company", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website [Your Website URL] (the "Site") and the services, features, content, applications, or widgets offered by Campus Sathi (collectively with the Site, the "Services").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Services. Please read them carefully.
            </p>
             <p className="text-gray-700 leading-relaxed">
              <strong>***[Clearly define who can use the service - age restrictions, etc.]***</strong>
            </p>
          </section>

          {/* Description of Services */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Description of Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Campus Sathi provides college counseling, prediction tools, information resources, and related services designed to assist students in their college admission process.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>***[Provide a more detailed description of ALL services offered, including free and paid tiers. Mention limitations, e.g., predictions are estimates, counseling is guidance, etc.]***</strong>
            </p>
             <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Services (or any part thereof) at any time with or without notice.
            </p>
          </section>

          {/* User Accounts & Responsibilities */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Accounts and Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed">
              To access certain features of the Services, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
              <li>Provide accurate, current, and complete information during the registration process.</li>
              <li>Maintain the security of your password and identification.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for ensuring that the information you provide (e.g., exam scores, preferences) is accurate. The quality and relevance of our Services depend on the accuracy of this input.
            </p>
             <p className="text-gray-700 leading-relaxed">
              <strong>***[Add rules about prohibited conduct - e.g., misuse of service, sharing accounts, posting harmful content, etc.]***</strong>
            </p>
          </section>

          {/* Payments and Subscriptions (If Applicable) */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Payments, Fees, and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Certain Services may be subject to payment ("Paid Services"). By selecting a Paid Service, you agree to pay Campus Sathi the specified fees.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>***[Detail your payment terms: currency, payment methods accepted, subscription terms (if any), billing cycles, auto-renewal policies, how to cancel.]***</strong>
            </p>
             <p className="text-gray-700 leading-relaxed">
              All fees are [**Specify if refundable or non-refundable, link to Return/Refund Policy**]. Please refer to our <a href="/return-refund-policy" className="text-blue-600 hover:underline">Return and Refund Policy</a> for details on eligibility and process.
            </p>
             <p className="text-gray-700 leading-relaxed">
              We reserve the right to change our prices at any time. Price changes will be communicated in advance.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              The Services and their original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Campus Sathi and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Campus Sathi.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are granted a limited, non-exclusive, non-transferable license to access and use the Services for your personal, non-commercial use, subject to these Terms.
            </p>
            {/* ***[Add clauses about user-generated content if applicable - ownership, licenses granted to you]*** */}
          </section>

          {/* Disclaimers */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed">
              The Services are provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Services is at your sole risk.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Campus Sathi expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We do not warrant that: (a) the Services will meet your specific requirements; (b) the Services will be uninterrupted, timely, secure, or error-free; (c) the results obtained from the use of the Services (including predictions or recommendations) will be accurate, reliable, or complete; or (d) any errors in the Services will be corrected.
            </p>
            <p className="text-gray-700 leading-relaxed">
              College admission predictions and recommendations are based on historical data and algorithms; they are estimates and not guarantees of admission. Final admission decisions rest solely with the respective colleges and universities.
            </p>
            {/* ***[Tailor disclaimers to your specific service limitations]*** */}
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by applicable law, in no event shall Campus Sathi, its affiliates, directors, employees, agents, suppliers, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Services; (ii) any conduct or content of any third party on the Services; (iii) any content obtained from the Services; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
            </p>
            {/* ***[Consult legal counsel regarding liability caps if applicable/permissible]*** */}
          </section>

          {/* Governing Law */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of [**Your State/Province, Country, e.g., Maharashtra, India**], without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>***[Specify jurisdiction for disputes, e.g., courts in Pune, Maharashtra]***</strong>
            </p>
          </section>

           {/* Changes to Terms */}
           <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least [**e.g., 30 days'**] notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
             <p className="text-gray-700 leading-relaxed">
              By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-10 pt-6 border-t border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By email: [**Your Support Email Address**] <br />
              By visiting this page on our website: [**Link to your Contact Us page (Optional)**] <br />
              By mail: [**Your Company Address - Optional**]
            </p>
             <p className="text-gray-700 leading-relaxed mt-4">
              <strong>***[Fill in your actual contact details]***</strong>
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}