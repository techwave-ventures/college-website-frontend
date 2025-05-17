// File: app/blogs/MHTCET/mht-cet-cutoff-explorer/page.jsx

// No "use client" - This is a Server Component

import React from 'react';
import Link from 'next/link';
import fs from 'fs/promises'; // Node.js file system module (async version)
import path from 'path';      // Node.js path module
import Navbar from "../../../_components/Navbar"; // Adjust path
import Footer from "../../../_components/Footer"; // Adjust path
import MhtCetSidebar from "../components/MhtCetSidebar"; // Import the sidebar
import { ExternalLink } from 'lucide-react'; // Icon for external links

// --- Helper function to format directory names into titles ---
// (Should ideally be in a shared utils file)
function formatDirectoryName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// --- Function to get MHTCET blog posts (runs on the server) ---
// (Should ideally be in a shared utils file)
async function getMhtCetBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'app', 'blogs', 'MHTCET');
  let postData = [];
  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'components') {
        const postSlug = entry.name;
        const postPath = `/blogs/MHTCET/${postSlug}`;
        const postTitle = formatDirectoryName(postSlug);
        postData.push({ href: postPath, label: postTitle });
      }
    }
    postData.sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error("Error reading MHTCET blog directory:", error);
    postData = [];
  }
  return postData;
}



// --- Add this metadata object for the Cutoff Explorer page ---
export const metadata = {
  title: 'MHT-CET Cutoff Explorer',
  description: 'Explore official MHT-CET engineering cutoff PDFs for 2022, 2023, and 2024 admission years. Analyze trends and plan your college preferences for Maharashtra.',
  keywords: ['MHT-CET cutoffs', 'MHT-CET 2024 cutoffs', 'MHT-CET 2023 cutoffs', 'MHT-CET 2022 cutoffs', 'engineering cutoffs Maharashtra', 'CAP round cutoffs', 'college cutoff explorer', 'Campus Sathi'],
};
// --- End metadata object ---

// --- Main Page Component (Async Server Component) ---
export default async function MhtCetCutoffExplorerPage() {

  const lastUpdatedDate = "May 6, 2025"; // Update as needed

  // Fetch the list of sibling posts on the server
  const sidebarLinks = await getMhtCetBlogPosts();

  // --- Cutoff Links Data ---
  // Verify these links, especially the constructed ones for MS rounds
  const cutoffLinks = {
    "2024": [ // Based on fe2024 domain (likely refers to 2023 data used for 2024 admissions)
      { label: "CAP Round I (All India Seats)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP1_AI_CutOff.pdf" },
      { label: "CAP Round I (MH & Minority Seats)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP1_MS_CutOff.pdf" }, // Constructed URL - VERIFY
      { label: "CAP Round II (All India Seats)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP2_AI_CutOff.pdf" },
      { label: "CAP Round II (MH & Minority Seats)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP2_MS_CutOff.pdf" }, // Constructed URL - VERIFY
      { label: "CAP Round III (MH & Minority Seats)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP3_MS_CutOff.pdf" }, // Constructed URL - VERIFY
    ],
    "2023": [ // Based on fe2023 domain (likely refers to 2022 data used for 2023 admissions)
      { label: "CAP Round I (All India Seats)", url: "https://fe2023.mahacet.org/2022/2022ENGG_CAP1_CutOff.pdf" }, // URL provided by user seems to be AI
      { label: "CAP Round I (MH & Minority Seats)", url: "https://fe2023.mahacet.org/2022/2022ENGG_CAP1_MS_CutOff.pdf" }, // Constructed URL - VERIFY
      { label: "CAP Round II (MH & Minority Seats)", url: "https://fe2023.mahacet.org/2022/2022ENGG_CAP2_CutOff.pdf" },
      { label: "CAP Round III (MH & Minority Seats)", url: "https://fe2023.mahacet.org/2022/2022ENGG_CAP3_CutOff.pdf" },
    ],
    "2022": [ // Based on fe2022 domain (likely refers to 2021 data used for 2022 admissions)
      { label: "CAP Round I (All India Seats)", url: "https://fe2022.mahacet.org/2021/2021ENGG_CAP1_CutOff.pdf" }, // URL provided by user seems to be AI
      { label: "CAP Round I (MH & Minority Seats)", url: "https://fe2022.mahacet.org/2021/2021ENGG_CAP1_MS_CutOff.pdf" }, // Constructed URL - VERIFY
      { label: "CAP Round II (MH & Minority Seats)", url: "https://fe2022.mahacet.org/2021/2021ENGG_CAP2_CutOff.pdf" },
      { label: "CAP Round III (MH & Minority Seats)", url: "https://fe2022.mahacet.org/2021/2021ENGG_CAP3_CutOff.pdf" },
    ]
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area with Sidebar */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row">

          {/* Sidebar Component */}
          <MhtCetSidebar links={sidebarLinks} />

          {/* Blog Post Content Area */}
          <article className="flex-grow bg-white p-6 md:p-10 rounded-lg shadow-lg border border-gray-200">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 MHT CET Engineering Cutoff Explorer (2022–2024 Data)
            </h1>

            <p className="text-sm text-gray-500 mb-8 border-b border-gray-300 pb-4">
              Last Updated: {lastUpdatedDate}
            </p>

            {/* Introduction */}
            <section className="mb-10 prose prose-indigo max-w-none">
              <p>
                Understanding previous years' cutoffs is crucial for setting realistic expectations and strategizing your MHT CET preference list. Below you'll find direct links to the official cutoff PDFs released by the State CET Cell for the past few admission years.
              </p>
              <p className="italic text-sm">
                Note: The admission year (e.g., 2024) often uses data/links from the previous calendar year (e.g., 2023). We've organized them by the admission year for clarity. Please verify link targets.
              </p>
            </section>

            {/* Cutoff Links Section */}
            <section className="mb-10 space-y-8">
              {Object.entries(cutoffLinks).reverse().map(([year, links]) => ( // Show recent year first
                <div key={year}>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    📅 {year} Admission Year Cutoffs
                  </h2>
                  <ul className="space-y-3 list-none pl-0">
                    {links.map((link) => (
                      <li key={link.url} className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                        <a
                          href={link.url}
                          target="_blank" // Open PDF in new tab
                          rel="noopener noreferrer" // Security best practice
                          className="flex items-center justify-between text-indigo-700 hover:text-indigo-900 font-medium"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* How to Use Section */}
            <section className="mb-10 prose prose-indigo max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">🔍 How to Use These Cutoff PDFs</h2>
              <p>Each PDF contains detailed information, including:</p>
              <ul>
                <li>Institute Code & Name</li>
                <li>Course Code & Name</li>
                <li>Category-wise Cutoff Percentiles (or Ranks, depending on the year/round)</li>
                <li>Seat Type (Home University (HU), Other Than Home University (OHU), State Level (SL), All India (AI), Minority, TFWS, etc.)</li>
                <li>Round-wise Allotment Details</li>
              </ul>
              <p>To efficiently navigate these PDFs:</p>
              <ol>
                <li><strong>Use the Search Function (Ctrl + F or Cmd + F):</strong> Enter your desired institute code/name, course name, or category (e.g., "GOPENH", "LOBCH", "AI") to quickly locate relevant information.</li>
                <li><strong>Analyze Trends:</strong> Compare cutoffs across different years and rounds (Round 1 vs. Round 2 vs. Round 3) to gauge the competitiveness of specific programs and how cutoffs might change.</li>
                <li><strong>Plan Accordingly:</strong> Use this data to set realistic expectations for colleges you might get based on your expected percentile and category. Strategize your preference list during counseling.</li>
                 <li><strong>Use Preference List Generator:</strong> Our <Link href="/pref-list-generator" className="text-blue-600 hover:underline">Preference List Generator</Link> is one of the best tools available to generate a personalized preference list based on your percentile, preferred location, and branch — helping you make smarter and more strategic choices during counseling.</li>
              </ol>
            </section>

             {/* Disclaimer */}
            <section className="mt-10 pt-6 border-t border-gray-300 prose prose-indigo max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Important Disclaimer</h2>
                 <p className="text-sm italic">
                    Cutoffs change every year based on factors like the number of applicants, difficulty level of the exam, seat availability, and preference patterns. Past cutoffs are indicative and do not guarantee admission in the current year. Always refer to the official CET Cell website for the most current and accurate information.
                 </p>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}