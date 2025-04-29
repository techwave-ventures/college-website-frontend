// File: app/blogs/MHTCET/page.jsx

// No "use client" - This is now a Server Component

import React from 'react';
import Link from 'next/link';
import fs from 'fs/promises'; // Node.js file system module (async version)
import path from 'path';      // Node.js path module
import Navbar from "../../_components/Navbar"; // Adjust path
import Footer from "../../_components/Footer"; // Adjust path
import MhtCetSidebar from "./components/MhtCetSidebar"; // Import the sidebar
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

// --- Helper function to format directory names into titles ---
function formatDirectoryName(name) {
  return name
    .split('-') // Split by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join with spaces
}

// --- Function to get blog posts (runs on the server) ---
async function getMhtCetBlogPosts() {
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

        // TODO: Enhance this to read metadata (description, date) from a file
        // inside each post directory (e.g., meta.json or page.jsx export)
        // For now, using placeholder description and derived title.
        postData.push({
          title: postTitle,
          description: `Read more about ${postTitle}.`, // Placeholder description
          href: postPath,
          // date: "Fetch date if available", // Placeholder for date
        });
      }
    }
    // Optional: Sort posts if needed (e.g., by date if you add metadata)
     // postData.sort((a, b) => new Date(b.date) - new Date(a.date));

  } catch (error) {
    console.error("Error reading MHTCET blog directory:", error);
    // Handle error appropriately, maybe return empty array or throw
    postData = [];
  }

  return postData;
}

// --- Main Page Component (Async Server Component) ---
export default async function MhtCetBlogIndexPage() {

  // Fetch the list of posts on the server
  const posts = await getMhtCetBlogPosts();

  // Limit to showing max 10 posts (can be done after fetching if sorting)
  const postsToShow = posts.slice(0, 10);

  // Prepare links for the sidebar prop
  const sidebarLinks = posts.map(post => ({
      href: post.href,
      label: post.title // Use the formatted title for the label
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area with Sidebar */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row">

          {/* Sidebar Component - Pass dynamically generated links */}
          <MhtCetSidebar links={sidebarLinks} />

          {/* Blog Post Listing Area */}
          <div className="flex-grow">
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
               MHT CET Blog Posts & Updates
             </h1>

             {postsToShow.length > 0 ? (
               <div className="space-y-8">
                 {postsToShow.map((post) => (
                   <Card key={post.href} className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                     <CardHeader>
                       <CardTitle className="text-2xl font-semibold text-gray-800 hover:text-indigo-700">
                         <Link href={post.href}>
                           {post.title}
                         </Link>
                       </CardTitle>
                       {/* Optional: Add date display if you implement date fetching */}
                       {/* {post.date && (
                         <p className="text-sm text-gray-500 pt-1">
                           Published on: {post.date}
                         </p>
                       )} */}
                     </CardHeader>
                     <CardContent>
                       <CardDescription className="text-gray-700 leading-relaxed">
                         {post.description}
                       </CardDescription>
                     </CardContent>
                     <CardFooter>
                       <Link href={post.href} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                         Read More
                         <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                     </CardFooter>
                   </Card>
                 ))}
               </div>
             ) : (
                <div className="text-center py-10 text-gray-500 bg-white p-6 rounded-lg shadow border border-dashed">
                    No blog posts found in the '/app/blogs/MHTCET' directory (excluding 'components').
                </div>
             )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}