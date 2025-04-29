// File: app/blogs/MHTCET/document-checklist/page.jsx

// Remove "use client" - Make it a Server Component
// "use client";

import React from 'react';
import Link from 'next/link'; // Keep Link for content links
import fs from 'fs/promises'; // Node.js file system module (async version)
import path from 'path';      // Node.js path module
import Navbar from "../../../_components/Navbar"; // Adjust path: Go up two levels
import Footer from "../../../_components/Footer"; // Adjust path: Go up two levels
import MhtCetSidebar from "../components/MhtCetSidebar"; // Import the sidebar component

// --- Helper function to format directory names into titles ---
// (Copied from the index page - could be moved to a shared utils file)
function formatDirectoryName(name) {
  return name
    .split('-') // Split by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join with spaces
}

// --- Function to get MHTCET blog posts (runs on the server) ---
// (Copied from the index page - could be moved to a shared utils file)
async function getMhtCetBlogPosts() {
  // Get posts from the parent MHTCET directory
  const postsDirectory = path.join(process.cwd(), 'app', 'blogs', 'MHTCET');
  let postData = [];

  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });

    for (const entry of entries) {
      // Check if it's a directory and NOT the 'components' directory
      if (entry.isDirectory() && entry.name !== 'components') {
        const postSlug = entry.name;
        const postPath = `/blogs/MHTCET/${postSlug}`;
        const postTitle = formatDirectoryName(postSlug);

        // TODO: Enhance this later to read metadata if needed
        postData.push({
          href: postPath,
          label: postTitle, // Use 'label' to match sidebar prop expectation
        });
      }
    }
     // Optional: Sort posts if needed (e.g., alphabetically by label)
     postData.sort((a, b) => a.label.localeCompare(b.label));

  } catch (error) {
    console.error("Error reading MHTCET blog directory:", error);
    postData = [];
  }

  return postData;
}


// --- Main Page Component (Now Async Server Component) ---
export default async function MhtCetDocumentChecklistPage() {

  const lastUpdatedDate = "April 29, 2025"; // Update as needed

  // Fetch the list of sibling posts on the server
  const sidebarLinks = await getMhtCetBlogPosts();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area with Sidebar */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Use Flexbox for layout */}
        <div className="flex flex-col md:flex-row">

          {/* Sidebar Component - Pass dynamically fetched links */}
          <MhtCetSidebar links={sidebarLinks} />

          {/* Blog Post Content Area */}
          <article className="flex-grow bg-white p-6 md:p-10 rounded-lg shadow-lg border border-gray-200">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              MHT CET Counseling - Document Checklist & FAQs
            </h1>

            <p className="text-sm text-gray-500 mb-8 border-b border-gray-300 pb-4">
              Last Updated: {lastUpdatedDate}
            </p>

            {/* Introduction */}
            <section className="mb-8 prose prose-indigo max-w-none">
              <p>
                Having the correct documents ready is essential for a smooth MHT CET counselling and admission process. Missing or invalid documents can lead to delays or even cancellation of your candidature under a specific category. This checklist outlines the common documents required based on category.
              </p>
               <p className="font-semibold text-red-600">
                 Disclaimer: Always refer to the official Information Brochure published by the State CET Cell for the specific admission year for the definitive list and formats. Requirements might change slightly year to year.
               </p>
            </section>

            {/* Document Checklist by Category */}
            <section className="mb-8 space-y-6 prose prose-indigo max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 !mt-0">Document Checklist by Category</h2>

              {/* Category 1 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. General / Open Category (No Reservation)</h3>
                <ul className="list-disc pl-6">
                  <li>10th Marksheet</li>
                  <li>12th Marksheet (or equivalent)</li>
                  <li>MHT CET Scorecard (Download from official website)</li>
                  <li>School Leaving Certificate / Transfer Certificate (TC)</li>
                  <li>Domicile Certificate (Required if applying under Maharashtra State Quota. Proves you are a resident of Maharashtra.)</li>
                  <li>Nationality Certificate (Often mentioned on Leaving Certificate or Birth Certificate. Alternatively, a Passport or specific certificate works.)</li>
                </ul>
              </div>

              {/* Category 2 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. OBC / SBC / VJNT / DT-A / NT-B / NT-C / NT-D</h3>
                 <p><strong>All documents listed under General Category, PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Caste Certificate (Issued by competent authority of Maharashtra)</li>
                  <li>Caste Validity Certificate (Issued by Caste Scrutiny Committee of Maharashtra)</li>
                  <li>Non-Creamy Layer (NCL) Certificate (Must be valid up to 31st March of the admission year. Issued by competent authority.)</li>
                  <li>Income Certificate (Often required by the authority issuing the NCL certificate)</li>
                </ul>
              </div>

              {/* Category 3 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. SC / ST</h3>
                 <p><strong>All documents listed under General Category, PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Caste Certificate (Issued by competent authority of Maharashtra)</li>
                  <li>Caste Validity Certificate (Issued by Caste Scrutiny Committee of Maharashtra)</li>
                  <li>(Non-Creamy Layer Certificate is NOT required for SC/ST candidates)</li>
                </ul>
              </div>

              {/* Category 4 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4. EWS (Economically Weaker Section)</h3>
                 <p><strong>All documents listed under General Category, PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>EWS Certificate (Issued by Tehsildar/competent authority of Maharashtra, valid for the financial year relevant to admission.)</li>
                  <li>Income Certificate (Used to prove family annual income is below the prescribed limit, typically ₹8 Lakhs, for EWS eligibility.)</li>
                </ul>
              </div>

               {/* Category 5 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Minority (Religious/Linguistic)</h3>
                 <p><strong>All documents listed under General Category, PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Minority Status Declaration (Self-declaration, often in a specific proforma format mentioned in the brochure)</li>
                  <li>Proof of Religion/Mother Tongue (May be mentioned on Leaving Certificate, or specific affidavit/certificate if required)</li>
                </ul>
              </div>

               {/* Category 6 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6. PWD (Persons with Disability)</h3>
                 <p><strong>All documents from applicable category (General/Reserved), PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>PWD Certificate (Issued by designated Civil Surgeon/Medical Board, indicating type and percentage of disability - usually 40% or more required)</li>
                </ul>
              </div>

               {/* Category 7 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">7. Defense (Children of Ex-Servicemen / Active Defense Personnel)</h3>
                 <p><strong>All documents from applicable category (General/Reserved), PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Defense Service Certificate (Specific certificate indicating service details, e.g., Ex-Serviceman I-Card, Service Certificate for active personnel)</li>
                  <li>Proforma C (Mandatory Certificate from Zilla Sainik Board/Competent Defense Authority confirming eligibility for educational concessions)</li>
                  <li>Domicile Certificate (Domicile of student or parent in Maharashtra, depending on the specific defense category type as per brochure)</li>
                </ul>
              </div>

               {/* Category 8 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">8. Orphan / Child of Single Parent</h3>
                 <p><strong>All documents from applicable category (General/Reserved), PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Relevant Certificates (e.g., Death Certificate of parent(s), Certificate from Orphanage, Single Parent declaration/certificate as per rules)</li>
                  <li>Supporting Affidavit / Court Document (If applicable)</li>
                </ul>
              </div>

               {/* Category 9 */}
               <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">9. TFWS (Tuition Fee Waiver Scheme)</h3>
                 <p><strong>All documents from applicable category (General/Reserved), PLUS:</strong></p>
                <ul className="list-disc pl-6">
                  <li>Income Certificate (Proving family annual income from all sources is less than the prescribed limit, typically ₹8 Lakhs, for the relevant financial year)</li>
                </ul>
              </div>

            </section>

             {/* QNA Section */}
            <section className="mt-10 pt-6 border-t border-gray-300 prose prose-indigo max-w-none">
                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Common Questions (FAQs)</h2>

                 <div className="space-y-6">
                    {/* Q1 */}
                    <div>
                        <p className="font-semibold">❓ Q1: Is document verification online or offline?</p>
                        <p>✅ Answer: MHT CET CAP rounds primarily use e-Scrutiny Centers for online document verification. You upload scanned documents during registration, and they are verified remotely by the assigned center. Check your login regularly for scrutiny status (Approved, Pending, Rejected with Reason). Some special cases or discrepancies might require physical verification at designated centers.</p>
                    </div>
                    {/* Q2 */}
                    <div>
                        <p className="font-semibold">❓ Q2: What if I don’t have a domicile certificate?</p>
                        <p>✅ Answer: A Domicile Certificate of Maharashtra is mandatory for candidates claiming seats under the Maharashtra State Quota (Type A, B, etc.). Without it, you will likely be considered under the All India Quota or OMS (Outside Maharashtra State) category, which usually have significantly fewer seats and higher cutoffs in Maharashtra colleges. Obtain it from your local Tehsildar/competent authority well in advance.</p>
                    </div>
                    {/* Q3 */}
                    <div>
                        <p className="font-semibold">❓ Q3: Do I need a Non-Creamy Layer Certificate every year?</p>
                        <p>✅ Answer: Yes. The Non-Creamy Layer (NCL) certificate for categories like OBC, SBC, VJ/DT, NT-B/C/D must be valid up to 31st March of the admission year (e.g., for 2025 admission, it should be valid till March 31, 2026). Ensure it clearly states validity for the required period. An expired certificate will result in your candidature being considered under the General/Open category.</p>
                    </div>
                    {/* Q4 */}
                    <div>
                        <p className="font-semibold">❓ Q4: I have my caste certificate, but not the caste validity. Can I still apply?</p>
                        <p>✅ Answer: For reserved categories (SC, ST, OBC, SBC, VJ/DT, NT), both the Caste Certificate AND the Caste Validity Certificate are mandatory. If you have applied for Caste Validity but haven't received it, you usually need to upload the application receipt during registration. However, you MUST produce the original Caste Validity Certificate during admission confirmation at the allotted college. Failure to do so will likely result in your admission under that category being cancelled, and you'll be considered under Open category if eligible based on merit.</p>
                    </div>
                    {/* Q5 */}
                     <div>
                        <p className="font-semibold">❓ Q5: Is Income Certificate mandatory for EWS/TFWS/OBC?</p>
                        <p>✅ Answer: Yes, generally:</p>
                        <ul className="list-disc pl-6">
                            <li><strong>For EWS:</strong> Mandatory to prove annual family income is below the ₹8 Lakh threshold.</li>
                            <li><strong>For TFWS:</strong> Mandatory to prove annual family income is below the ₹8 Lakh threshold for eligibility.</li>
                            <li><strong>For OBC/VJNT/SBC etc.:</strong> It's required by the issuing authority to grant the Non-Creamy Layer (NCL) certificate. So, while you upload the NCL, the income certificate was necessary to obtain it.</li>
                        </ul>
                    </div>
                     {/* Q6 */}
                     <div>
                        <p className="font-semibold">❓ Q6: What is Proforma C for Defense category?</p>
                        <p>✅ Answer: Proforma C is a specific format certificate prescribed by the CET Cell, which needs to be obtained from the appropriate Defense authority (like Zilla Sainik Board for Ex-Servicemen, Commanding Officer for active personnel) confirming the parent's service details and the candidate's eligibility for educational concessions under the relevant Defense category (Def-1, Def-2, Def-3). It's mandatory for claiming a seat under the Defense quota.</p>
                    </div>
                     {/* Q7 */}
                     <div>
                        <p className="font-semibold">❓ Q7: I made a mistake during document upload. Can I re-upload?</p>
                        <p>✅ Answer: During the e-Scrutiny process, if the verifying center finds an issue with your uploaded document (e.g., unclear, incorrect, expired), they will typically mark your application status as "Rejected" or "Discrepancy Found" with a specific reason. You will usually be given a limited timeframe (a grievance period) to log back in and upload the correct/clear document. It's crucial to monitor your application status regularly after submission.</p>
                    </div>
                     {/* Q8 */}
                     <div>
                        <p className="font-semibold">❓ Q8: Do I need to carry original documents to college later?</p>
                        <p>✅ Answer: Absolutely YES. After seat allotment through CAP rounds, when you report to the finally allotted college to confirm your admission, you MUST carry all original documents submitted online, along with multiple sets of attested photocopies as required by the college. The college will physically verify your original documents before confirming your admission.</p>
                    </div>
                 </div>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
