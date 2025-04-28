// Suggested Path: app/college/[id]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic route parameters
import axios from 'axios';
import Navbar from '../../_components/Navbar'; // Adjust path relative to this file
import Footer from '../../_components/Footer'; // Adjust path relative to this file
// Added Book to the import list
import { Loader2, MapPin, CalendarDays, Building, GraduationCap, Briefcase, Info, Image as ImageIcon, CheckCircle, Book } from 'lucide-react'; // Icons
import { Badge } from '@/components/ui/badge'; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui

// Define the API base URL (use environment variable in production)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main.onrender.com/apiv1";
// Fallback image
const FALLBACK_IMAGE_URL = "https://placehold.co/600x400/e2e8f0/cbd5e1?text=College";

export default function CollegeDetailPage() {
  const params = useParams(); // Get route parameters { id: '...' }
  const id = params?.id; // Extract the id (corrected from params?.id)

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("College ID not found in URL.");
      setLoading(false);
      return;
    }

    const fetchCollegeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data for the specific college, assuming backend populates references
        const response = await axios.get(`${API_BASE_URL}/college/${id}`);
        if (response.data.success && response.data.college) {
          setCollege(response.data.college);
        } else {
          throw new Error(response.data.message || "College not found");
        }
      } catch (err) {
        console.error("Error fetching college details:", err);
        setError(err.response?.data?.message || err.message || "Failed to load college details.");
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [id]); // Re-fetch if id changes

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
        </main>
        <Footer />
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20 px-4">
          <div className="text-center text-red-600 bg-red-100 p-6 rounded-lg shadow">
            <p className="font-semibold">Error loading college data:</p>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Render College Not Found (Should ideally be caught by error state) ---
   if (!college) {
     return (
       <div className="flex flex-col min-h-screen">
         <Navbar />
         <main className="flex-grow flex items-center justify-center pt-20">
           <p className="text-xl text-gray-500">College not found.</p>
         </main>
         <Footer />
       </div>
     );
   }

  // --- Render College Details ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"> {/* Padding top for navbar */}
        {/* Header Section */}
        <section className="mb-10 md:mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white p-6 rounded-lg shadow-md">
          <img
            src={college.avatarImage?.imageUrl || FALLBACK_IMAGE_URL}
            alt={`${college.name} Logo`}
            className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-md border bg-white p-1"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{college.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin size={14} /> {college.location || 'N/A'}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} /> Est. {college.year || 'N/A'}</span>
              <span className="flex items-center gap-1"><Building size={14} /> {college.type || 'N/A'}</span>
            </div>
             <p className="text-xs text-gray-500 mt-1">DTE Code: {college.dteCode}</p>
             {college.affiliation && <Badge variant="secondary" className="mt-2">{college.affiliation}</Badge>}
          </div>
        </section>

        {/* Grid for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Info size={20} /> About {college.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap"> {/* Preserve line breaks */}
                  {college.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Admission Process */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Admission Process</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {college.admissionProcess || 'Admission process details not provided.'}
                 </p>
              </CardContent>
            </Card>

            {/* Courses Offered */}
             <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {/* Using the imported Book icon */}
                    <Book size={20}/> Courses Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {college.courses && college.courses.length > 0 ? (
                    <ul className="space-y-3">
                        {college.courses.map((course) => (
                            <li key={course._id} className="p-3 bg-gray-50 rounded-md border">
                                <p className="font-medium text-gray-800">{course.name}</p>
                                <p className="text-sm text-gray-600">Duration: {course.duration || 'N/A'}</p>
                                {/* Optionally link to a detailed course page */}
                                {/* <Link href={`/course/${course._id}`}><a className="text-blue-600 text-sm hover:underline">View Details</a></Link> */}
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-gray-500 italic">No specific course information available.</p>
                 )}
              </CardContent>
            </Card>

            {/* Review Summary */}
             {college.review && (
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Review Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-gray-700 leading-relaxed italic">
                        "{college.review}"
                     </p>
                  </CardContent>
                </Card>
             )}

          </div>

          {/* Right Column (Sidebar Info) */}
          <div className="lg:col-span-1 space-y-8">

             {/* Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                 {college.infrastructure && college.infrastructure.length > 0 ? (
                    <ul className="space-y-2">
                        {college.infrastructure.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-green-600 flex-shrink-0"/>
                                {item}
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-gray-500 italic">Infrastructure details not provided.</p>
                 )}
              </CardContent>
            </Card>

            {/* Placement Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase size={20}/> Placement Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 {college.placement ? (
                    <>
                        <p className="text-gray-700">
                            <span className="font-medium">Average Package:</span> ₹{college.placement.averageSalary?.toLocaleString('en-IN') || 'N/A'} LPA
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Highest Package:</span> ₹{college.placement.highestSalary?.toLocaleString('en-IN') || 'N/A'} LPA
                        </p>
                    </>
                 ) : (
                    <p className="text-gray-500 italic">Placement data not available.</p>
                 )}
              </CardContent>
            </Card>

            {/* Image Gallery */}
             <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <ImageIcon size={20}/> Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {college.images && college.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {college.images.map((image) => (
                            <img
                                key={image._id}
                                src={image.imageUrl || FALLBACK_IMAGE_URL}
                                alt={`${college.name} Gallery Image`}
                                className="w-full h-24 object-cover rounded-md border hover:opacity-80 transition-opacity"
                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
                            />
                        ))}
                    </div>
                 ) : (
                    <p className="text-gray-500 italic">No gallery images available.</p>
                 )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
