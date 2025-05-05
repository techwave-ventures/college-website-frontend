// Suggested file path: app/return-refund-policy/page.jsx (for App Router)
// Or: pages/return-refund-policy.jsx (for Pages Router)

"use client"; // Add this if using App Router

import React from 'react';
import Navbar from "../_components/Navbar"; // Adjust path as needed relative to this file
import Footer from "../_components/Footer"; // Adjust path as needed relative to this file

export default function ReturnRefundPolicyPage() {
  // **IMPORTANT**: Review all sections to ensure accuracy for your specific practices.
  // Consult with a legal/business expert to ensure accuracy and compliance.

  const lastUpdatedDate = "April 29, 2025"; // *** UPDATE THIS DATE WHEN POLICY CHANGES ***

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Added background */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg"> {/* Enhanced card styling */}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-4">
            Return and Refund Policy
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {lastUpdatedDate}
          </p>

          {/* Overview */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              Thank you for choosing Campus Sathi. We strive to provide valuable guidance and services to help you with your college admission journey. This policy outlines the terms under which returns or refunds may be considered for our paid services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Due to the nature of digital services and personalized guidance provided, refunds are generally limited but handled on a case-by-case basis under specific circumstances outlined below.
            </p>
          </section>

          {/* Eligibility for Refund */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Eligibility for a Refund</h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds are handled on a case-by-case basis. You may be eligible for a full or partial refund under the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
              <li>
                <strong>Service Not Rendered:</strong> If you paid for a specific service (e.g., a counseling session, a personalized report) and we failed to deliver that service within the agreed-upon timeframe due to reasons solely attributable to us.
              </li>
              <li>
                <strong>Technical Issues:</strong> In case of significant technical failure on our platform that prevents you from accessing or utilizing the core features of a paid service you purchased, and we are unable to resolve the issue within a reasonable time [Specify timeframe, e.g., 48 hours].
              </li>
              <li>
                <strong>Duplicate Charges:</strong> If you were accidentally charged multiple times for the same service.
              </li>
               {/* Add/Remove/Modify conditions. Be very specific. */}
               {/* Example: Cancellation of a scheduled session with 24 hours notice */}
            </ul>
          </section>

          {/* Non-Refundable Items/Services */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Non-Refundable Items/Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Generally, the following are non-refundable:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
              <li>
                <strong>Services Already Rendered:</strong> Fees for counseling sessions that have already taken place, or reports/lists that have already been generated and delivered electronically.
              </li>
              <li>
                <strong>Digital Products/Tools Access:</strong> Fees for accessing digital guides, checklists, or generator tools once they have been accessed or used.
              </li>
              <li>
                <strong>Subscription Periods:</strong> Fees for any subscription period that has already commenced or passed.
              </li>
              <li>
                <strong>Change of Mind:</strong> Refunds are generally not provided if you simply change your mind after purchasing or accessing a service.
              </li>
               {/* Be specific about what is NOT refundable. Align this with your terms of service. */}
            </ul>
          </section>

          {/* How to Request a Refund */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. How to Request a Refund</h2>
            <p className="text-gray-700 leading-relaxed">
              To request a refund based on the eligibility criteria mentioned above, please contact us within [Specify Timeframe, e.g., 7 days] of your purchase or the incident date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please email us at techwaveventures@gmail.com with the following information:
            </p>
             <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 pl-4">
                <li>Your full name and registered email address.</li>
                <li>Order number or transaction details (if applicable).</li>
                <li>The name of the service you are requesting a refund for.</li>
                <li>A clear explanation of the reason for your refund request, referencing the eligibility criteria.</li>
                <li>Any relevant supporting documentation (e.g., screenshots of technical issues).</li>
             </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We will review your request and notify you of the outcome via email within 7-15 business days.
             </p>
          </section>

          {/* Refund Processing */}
          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Refund Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              If your refund request is approved, it will be processed, and a credit will automatically be applied to your original method of payment within 7-15 business days. Please note that processing times may vary depending on your bank or payment provider.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you haven't received an approved refund after the specified timeframe, please first check with your bank or credit card company. If you've done this and still have not received your refund, please contact us.
            </p>
          </section>

           {/* Policy Changes */}
           <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Policy Changes</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify this Return and Refund Policy at any time. Any changes will be effective immediately upon posting the updated policy on our website. We encourage you to periodically review this policy to stay informed of updates.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-10 pt-6 border-t border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions concerning our return and refund policy, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Email: techwaveventures@gmail.com <br />
              Phone: 9209143384
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}