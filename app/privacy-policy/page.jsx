// Suggested file path: app/privacy-policy/page.jsx (for App Router)
// Or: pages/privacy-policy.jsx (for Pages Router)

import React from 'react';
import Navbar from "../_components/Navbar"; // Adjust path if needed relative to this file
import Footer from "../_components/Footer"; // Adjust path if needed relative to this file

export default function PrivacyPolicyPage() {
  // **IMPORTANT**: Replace all placeholder text below with your actual privacy policy.
  // Consult with a legal professional to ensure compliance.

  const lastUpdatedDate = "April 28, 2025"; // *** UPDATE THIS DATE WHEN POLICY CHANGES ***

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Added background */}
      <Navbar />

      {/* Main Content Area */}
      {/* Added top/bottom padding (pt-24 accounts for fixed navbar, pb-16 for space above footer) */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg"> {/* Enhanced card styling */}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-4">
            Privacy Policy
          </h1>

          <p className="text-sm text-gray-500 mb-8"> {/* Increased margin */}
            Last Updated: {lastUpdatedDate}
          </p>

          {/* Introduction */}
          <section className="mb-8 space-y-4"> {/* Added space-y for paragraph spacing */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Campus Sathi ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL] (the "Site") and use our services (the "Services").
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our Services. We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>***[Insert a brief summary of your service and its purpose here]***</strong>
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Collection of Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect via the Services depends on the content and materials you use, and includes:
            </p>
            <h3 className="text-lg font-semibold text-gray-700 pt-2">Personal Data</h3>
            <p className="text-gray-700 leading-relaxed">
              Personally identifiable information, such as your name, email address, phone number, educational background, entrance exam scores, preferences, and other similar data that you voluntarily give to us when you register with the Services or when you choose to participate in various activities related to the Services, such as online chat and message boards.
              <strong>***[Be specific and list ALL types of personal data you collect. E.g., address, date of birth, payment info if applicable]***</strong>
            </p>
             <h3 className="text-lg font-semibold text-gray-700 pt-2">Derivative Data</h3>
             <p className="text-gray-700 leading-relaxed">
              Information our servers automatically collect when you access the Services, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Services.
              <strong>***[Specify any other automatically collected data, e.g., device information, location data if collected]***</strong>
            </p>
            {/* Add other categories like Financial Data, Mobile Device Data, Third-Party Data if applicable */}
          </section>

          {/* Use of Your Information */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Use of Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Services to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
              <li>Create and manage your account.</li>
              <li>Provide you with personalized college recommendations and predictions.</li>
              <li>Email you regarding your account or order.</li>
              <li>Enable user-to-user communications (if applicable).</li>
              <li>Generate a personal profile about you to make future visits more personalized.</li>
              <li>Increase the efficiency and operation of the Services.</li>
              <li>Monitor and analyze usage and trends to improve your experience.</li>
              <li>Notify you of updates to the Services.</li>
              <li>Offer new products, services, and/or recommendations to you.</li>
              <li>Perform other business activities as needed.</li>
              <li>Request feedback and contact you about your use of the Services.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
              <li>Respond to product and customer service requests.</li>
              <li>Send you a newsletter (if applicable).</li>
               {/* ***[Add/Remove/Modify these points to accurately reflect ALL ways you use the collected data]*** */}
            </ul>
          </section>

          {/* Disclosure of Your Information */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Disclosure of Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
             <h3 className="text-lg font-semibold text-gray-700 pt-2">By Law or to Protect Rights</h3>
            <p className="text-gray-700 leading-relaxed">
               If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>
             <h3 className="text-lg font-semibold text-gray-700 pt-2">Third-Party Service Providers</h3>
             <p className="text-gray-700 leading-relaxed">
                We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                <strong>***[List categories of service providers, e.g., Cloud hosting providers (AWS/GCP/Azure), Analytics providers (Google Analytics), Payment processors (Stripe/Razorpay), Email service providers (SendGrid)]***</strong>
             </p>
             {/* Add other scenarios like Business Transfers, Affiliates, Marketing Communications, User Interactions, etc., if applicable */}
             <p className="text-gray-700 leading-relaxed mt-2">
                <strong>***[Clearly state if you sell user data or not]***</strong> We do not sell your personal information.
             </p>
          </section>

          {/* Tracking Technologies */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Tracking Technologies</h2>
             <h3 className="text-lg font-semibold text-gray-700 pt-2">Cookies and Web Beacons</h3>
            <p className="text-gray-700 leading-relaxed">
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Services to help customize the Services and improve your experience. When you access the Services, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Services.
              <strong>***[Add details about specific types of cookies used - essential, performance, functional, advertising - and link to a Cookie Policy if you have one]***</strong>
            </p>
            {/* Add sections for Website Analytics (e.g., Google Analytics) if used */}
          </section>

          {/* Security of Your Information */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Security of Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              <strong>***[Briefly mention specific measures if appropriate, e.g., encryption, access controls, but avoid overly technical details]***</strong>
            </p>
          </section>

          {/* Policy for Children */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Policy for Children</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not knowingly solicit information from or market to children under the age of 13 [**Adjust age based on legal requirements, e.g., 16 for GDPR/CCPA in some cases**]. If we learn that we have collected personal information from a child under the relevant age without verification of parental consent, we will delete that information as quickly as possible. If you become aware of any data we may have collected from children under the relevant age, please contact us using the contact information provided below.
            </p>
          </section>

           {/* Your Privacy Rights */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Your Privacy Rights</h2>
             <h3 className="text-lg font-semibold text-gray-700 pt-2">Account Information</h3>
            <p className="text-gray-700 leading-relaxed">
              You may at any time review or change the information in your account or terminate your account by:
            </p>
             <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
                <li>Logging into your account settings and updating your account</li>
                <li>Contacting us using the contact information provided below</li>
                 {/* ***[Ensure these methods are actually available to users]*** */}
             </ul>
             <p className="text-gray-700 leading-relaxed mt-2">
                Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
             </p>
             {/* ***[Add sections specific to GDPR, CCPA, or other regional rights if applicable, e.g., Right to Access, Rectification, Erasure, Data Portability, Opt-out of Sale]*** */}
          </section>

          {/* Contact Us */}
          <section className="mt-10 pt-6 border-t border-gray-300"> {/* Added top border */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Campus Sathi <br />
              [Your Company Address, Line 1] <br />
              [Your Company Address, Line 2] <br />
              [City, State, Zip Code] <br />
              [Country] <br />
              [Your Contact Email Address] <br />
              [Your Contact Phone Number (Optional)]
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