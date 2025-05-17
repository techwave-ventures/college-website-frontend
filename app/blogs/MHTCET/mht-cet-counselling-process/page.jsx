// File: app/blogs/MHTCET/mht-cet-counselling-process/page.jsx

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
// (Should ideally be in a shared utils file)
function formatDirectoryName(name) {
  return name
    .split('-') // Split by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join with spaces
}

// --- Function to get MHTCET blog posts (runs on the server) ---
// (Should ideally be in a shared utils file)
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



// --- Add this metadata object for the Counselling Process page ---
export const metadata = {
  title: 'MHT-CET 2025 Counselling Process Explained',
  description: 'Step-by-step guide to the MHT-CET 2025 counselling process (CAP Rounds), including registration, document upload, choice filling, seat allotment, and admission confirmation for engineering and pharmacy in Maharashtra.',
  keywords: ['MHT-CET counselling', 'MHT-CET 2025 process', 'CAP rounds Maharashtra', 'engineering admission process', 'pharmacy admission process', 'choice filling MHT-CET', 'seat allotment MHT-CET', 'Campus Sathi'],
};
// --- End metadata object ---




// --- Main Page Component (Now Async Server Component) ---
export default async function MhtCetCounsellingProcessPage() {

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
              MHT CET 2025 Counselling Process Explained
            </h1>

            <p className="text-sm text-gray-500 mb-8 border-b border-gray-300 pb-4">
              Last Updated: {lastUpdatedDate}
            </p>

            {/* Introduction */}
            <section className="mb-8 prose prose-indigo max-w-none">
              <p>
                The complete MHT CET counselling process (CAP Rounds) is conducted online through the State CET Cell, Maharashtra website. Understanding the steps involved is crucial for a smooth admission process.
              </p>
              <p>
                Candidates can check all the steps involved in the MHT CET 2025 counselling below:
              </p>
            </section>

            {/* Steps */}
            <section className="mb-8 space-y-6 prose prose-indigo max-w-none">
              {/* Step 1 */}
              <div>
                 <h2 className="text-xl font-semibold text-gray-800 mb-2 !mt-0">Step 1: Registration</h2>
                 <p>
                   The first step is to register on the official CET Cell website (<a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cetcell.mahacet.org</a> - *link may change for the specific admission year*). You will need to submit your personal, communication, and security details.
                 </p>
                 <p>
                   After filling in initial details, you'll generate a password. Once the password is generated, log in again to fill in the remaining details, including:
                 </p>
                 <ul className="list-disc pl-6">
                   <li>Qualification details (Subject-wise and overall marks/percentage in 10th and 12th standard).</li>
                   <li>Name of the Board (HSC, CBSE, ICSE, etc.).</li>
                   <li>MHT CET examination details (Application number, Roll number, Score).</li>
                 </ul>
              </div>

              {/* Step 2 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Uploading Scanned Documents</h2>
                <p>
                  At this step, aspirants will have to upload clear scanned copies of their required documents. Pay close attention to the specified formats and sizes:
                </p>
                <ul className="list-disc pl-6">
                    <li><strong>Photograph:</strong> Size 4KB to 100KB, dimensions approx. 3.5cm x 4.5cm.</li>
                    <li><strong>Signature:</strong> Size 1KB to 30KB, dimensions approx. 3.5cm x 1.5cm.</li>
                    <li><strong>Other Documents:</strong> Usually PDF format, size limits as specified on the portal (e.g., under 500KB or 1MB).</li>
                </ul>
                 {/* Ensure the link path is correct based on your structure */}
                 <p>Refer to the <Link href="/blogs/MHTCET/document-checklist" className="text-blue-600 hover:underline">Document Checklist</Link> for category-wise required documents.</p>
              </div>

              {/* Step 3 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Payment of Counselling Fees</h2>
                <p>
                  Lastly, aspirants are required to pay the non-refundable counselling fees online (using Net Banking, Credit/Debit Card, UPI etc.) based on their category. The typical fee structure is:
                </p>
                <ul className="list-disc pl-6">
                    <li><strong>General Category, Outside Maharashtra State (OMS) Applicant, Children of Indian workers in Gulf Countries:</strong> ₹800</li>
                    <li><strong>Reserved Category from Maharashtra State (SC, ST, VJ/DT- NT(A), NT(B), NT(C), NT(D), OBC, SBC) and Persons with Disability (PwD) applicants from Maharashtra:</strong> ₹600</li>
                    <li><strong>Children of NRI / OCI / PIO, Foreign National (FN):</strong> ₹5000</li>
                </ul>
                 <p className="text-sm italic">*Fee amounts are based on previous years and subject to change. Always refer to the official notification for the current year.*</p>
              </div>

              {/* Step 4 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 4: Release of Merit List</h2>
                <p>
                  The admission authority (CET Cell) will process the applications and release a Provisional Merit List. This list ranks candidates based on their merit score, typically calculated using Class 12th PCM/PCB percentage and MHT CET PCM/PCB percentile score (often with a 50:50 weightage, but confirm the exact formula for the year).
                </p>
                <p>
                  After the provisional list, there's usually a grievance period where candidates can submit objections online if they find discrepancies in their details or merit number. A Final Merit List is published after considering valid grievances. Your rank in the Final Merit List determines your standing for seat allocation.
                </p>
              </div>

              {/* Step 5 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 5: Choice Filling (Option Form Submission)</h2>
                <p>
                  This is a critical step. Candidates whose names appear in the Final Merit List need to log in and fill the Online Option Form for the CAP Round(s). You will select your preferred colleges and branches (courses) in order of preference.
                </p>
                 <p>
                   You can add multiple choices. The order matters significantly, as the system tries to allot the highest possible preference based on your merit rank and seat availability. Fill choices carefully and lock them before the deadline.
                 </p>
              </div>

              {/* Step 6 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 6: Seat Allotment and Admission</h2>
                <p>
                  Based on the locked choices and the candidate's merit number, the system allocates seats during each CAP Round. The results are published online.
                </p>
                 <p>
                   If a candidate is allotted a seat, they usually have options:
                 </p>
                 <ul className="list-disc pl-6">
                    <li><strong>Freeze:</strong> Accept the allotted seat and do not wish to participate in further rounds.</li>
                    <li><strong>Float (Not Applicable if allotted 1st preference):</strong> Accept the allotted seat but wish to be considered for higher preferences in subsequent rounds.</li>
                    <li><strong>Slide (Not Applicable if allotted 1st preference):</strong> Accept the allotted seat but wish to be considered for a higher preference within the *same* institute in subsequent rounds.</li>
                 </ul>
                 <p>
                   Candidates who accept a seat (Freeze/Float/Slide) must typically pay the Seat Acceptance Fee online and then report to an Admission Reporting Center (ARC) for document verification (if not done online) and finally report to the allotted institute within the specified dates to complete admission formalities and pay the institute fees. Failure to do so might result in cancellation of the allotted seat.
                 </p>
              </div>
            </section>

            {/* Conclusion or Further Steps */}
            <section className="mt-10 pt-6 border-t border-gray-300 prose prose-indigo max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Important Notes</h2>
                <ul className="list-disc pl-6">
                    <li>Always refer to the official MHT CET / State CET Cell website for the latest notifications, schedule, information brochure, and specific instructions for the current admission year.</li>
                    <li>Keep checking the website regularly during the entire counselling process for updates on deadlines, seat matrix, allotment results, etc.</li>
                    <li>Ensure all documents are ready and valid as per the requirements mentioned in the official brochure.</li>
                </ul>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}