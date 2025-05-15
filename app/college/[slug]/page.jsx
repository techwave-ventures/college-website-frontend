// File: app/college/[slug]/page.jsx 
// (Ensure your folder is named [slug] instead of [id])
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic route parameters
import axios from 'axios';
import Navbar from '../../_components/Navbar'; // Adjust path
import Footer from '../../_components/Footer';   // Adjust path
import CollegeDetailSidebar from '../../_components/CollegeDetailSidebar'; 
import { Loader2, MapPin, CalendarDays, Building, GraduationCap, Briefcase, Info, Image as ImageIcon, CheckCircle, Book, Users, BarChartHorizontal, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main.onrender.com/apiv1";
const FALLBACK_IMAGE_URL = "https://placehold.co/600x400/374151/9ca3af?text=College+Image";

// Define sections for the sidebar and content linking (remains the same)
const pageSections = [
    { id: "about-college", title: "About College" },
    { id: "admission-process", title: "Admission Process" },
    { id: "courses-offered", title: "Courses & Branches" },
    { id: "fees", title: "Fee Structure" },
    { id: "placements", title: "Placement Highlights" },
    { id: "infrastructure", title: "Infrastructure" },
    { id: "gallery", title: "Gallery" },
    { id: "review", title: "Review Summary" },
];

export default function CollegeDetailPage() {
  const params = useParams();
  // --- CHANGE: Get 'slug' from params ---
  const slug = params?.slug; 

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- CHANGE: Check for 'slug' ---
    if (!slug) {
      setError("College identifier (slug) not found in URL.");
      setLoading(false);
      return;
    }

    const fetchCollegeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- CHANGE: Fetch data using the slug ---
        console.log(`Fetching college data for slug: ${slug}`);
        // Ensure your backend has a route like GET /college/slug/:slug
        const response = await axios.get(`${API_BASE_URL}/college/slug/${slug}`); 
        if (response.data.success && response.data.college) {
          setCollege(response.data.college);
          console.log("Fetched College Data:", response.data.college);
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
  }, [slug]); // --- CHANGE: Re-fetch if slug changes ---

  // --- Loading, Error, and Not Found states remain the same ---
  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20">
            <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
          </main>
          <Footer />
        </div>
      );
  }
  if (error) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20 px-4">
            <div className="text-center text-red-400 bg-red-900/30 p-6 rounded-lg shadow border border-red-700">
              <p className="font-semibold">Error loading college data:</p>
              <p>{error}</p>
            </div>
          </main>
          <Footer />
        </div>
      );
  }
  if (!college) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20">
            <p className="text-xl text-gray-500">College not found.</p>
          </main>
          <Footer />
        </div>
      );
  }

  // --- Render College Details (JSX structure remains largely the same) ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <section className="mb-8 md:mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
          <img
            src={college.avatarImage?.imageUrl || FALLBACK_IMAGE_URL}
            alt={`${college.name} Logo`}
            className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-md border border-slate-600 bg-slate-700 p-1"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{college.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={14} /> {college.location || 'N/A'}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} /> Est. {college.year || 'N/A'}</span>
              <span className="flex items-center gap-1"><Building size={14} /> {college.type || 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">DTE Code: {college.dteCode}</p>
            {college.affiliation && <Badge variant="outline" className="mt-2 border-slate-600 text-slate-300 bg-slate-700">{college.affiliation}</Badge>}
          </div>
        </section>

        {/* Main layout with Sidebar */}
        <div className="flex flex-col md:flex-row">
          <CollegeDetailSidebar sections={pageSections} />

          {/* Scrollable Content Area - Wrapped in a single Card */}
          <Card className="flex-grow md:pl-4 p-6 md:p-8 shadow-xl border border-slate-700 bg-slate-800">
            <CardContent className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-invert text-gray-300">

              {/* About Section */}
              <section id="about-college" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 !mt-0 text-sky-400">
                    <Info size={24} /> About {college.name}
                </h2>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {college.description || 'No description available.'}
                </p>
              </section>

              {/* Admission Process */}
              <section id="admission-process" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><GraduationCap size={24} /> Admission Process</h2>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {college.admissionProcess || 'Admission process details not provided.'}
                </p>
              </section>

              {/* Courses Offered */}
              <section id="courses-offered" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><Book size={24} /> Courses & Branches Offered</h2>
                  {college.courses && college.courses.length > 0 ? (
                    <div className="space-y-4 not-prose">
                      {college.courses.map((course) => (
                        <div key={course._id || course.name} className="p-3 bg-slate-700/50 rounded-md border border-slate-600">
                          <h3 className="text-md font-semibold text-gray-100">{course.name} <span className="text-sm font-normal text-gray-400">({course.duration || 'N/A'})</span></h3>
                          {course.branches && course.branches.length > 0 ? (
                            <ul className="list-disc list-inside pl-4 space-y-1 mt-1 text-sm">
                              {course.branches.map((branch) => (
                                <li key={branch._id || branch.bName} className="text-gray-300">
                                  {branch.bName}
                                </li>
                              ))}
                            </ul>
                          ) : <p className="text-xs text-gray-500 italic mt-1">No specific branches listed.</p>}
                        </div>
                      ))}
                    </div>
                  ) : (<p className="italic text-gray-400">No specific course information available.</p>)}
              </section>

              {/* Fee Structure */}
              <section id="fees" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><DollarSign size={24}/> Fee Structure</h2>
                  {college.courses && college.courses.some(c => c.fees && c.fees.length > 0) ? (
                    <div className="space-y-3 not-prose">
                      {college.courses.map(course => course.fees && course.fees.length > 0 && (
                        <div key={`fee-${course._id || course.name}`}>
                          <h4 className="font-medium text-gray-200 text-sm">{course.name} Fees:</h4>
                          <ul className="list-disc list-inside pl-4 text-xs text-gray-400">
                            {course.fees.map((fee, idx) => (
                              <li key={idx}>{fee.category}: ₹{fee.amt?.toLocaleString('en-IN') || 'N/A'}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="italic text-gray-400">Fee structure not available.</p>)}
              </section>

              {/* Placement Highlights */}
              <section id="placements" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><Briefcase size={24}/> Placement Highlights</h2>
                <div className="space-y-1 text-gray-300 not-prose text-sm">
                  {college.courses && college.courses.some(c => c.placements) ? (
                     college.courses.map(course => course.placements && (
                        <div key={`placement-${course._id || course.name}`} className="mb-2 pb-1 border-b border-slate-700 last:border-b-0 last:pb-0">
                             <h4 className="font-medium text-gray-200">{course.name} Placements:</h4>
                             <p><span className="font-semibold">Average Package:</span> ₹{course.placements.averageSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                             <p><span className="font-semibold">Highest Package:</span> ₹{course.placements.highestSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                        </div>
                     ))
                  ) : (<p className="italic text-gray-400">Overall placement data not specified at course level.</p>)}
                  {!college.courses?.some(c => c.placements) && college.placement && (
                     <>
                        <p><span className="font-semibold">Average Package (Overall):</span> ₹{college.placement.averageSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                        <p><span className="font-semibold">Highest Package (Overall):</span> ₹{college.placement.highestSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                     </>
                  )}
                </div>
              </section>

              {/* Infrastructure */}
              <section id="infrastructure" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><Users size={24}/> Infrastructure</h2>
                  {college.infrastructure && college.infrastructure.length > 0 ? (
                    <ul className="space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 not-prose text-sm">
                      {college.infrastructure.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>{item}
                        </li>
                      ))}
                    </ul>
                  ) : (<p className="italic text-gray-400">Infrastructure details not provided.</p>)}
              </section>

              {/* Image Gallery */}
              <section id="gallery" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><ImageIcon size={24}/> Gallery</h2>
                  {college.images && college.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 not-prose">
                      {college.images.map((image) => (
                        <img
                          key={image._id || image.imageUrl}
                          src={image.imageUrl || FALLBACK_IMAGE_URL}
                          alt={`${college.name} Gallery Image`}
                          className="w-full h-32 object-cover rounded-md border border-slate-600 hover:opacity-80 transition-opacity cursor-pointer"
                          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
                          onClick={() => window.open(image.imageUrl, '_blank')}
                        />
                      ))}
                    </div>
                  ) : (<p className="italic text-gray-400">No gallery images available.</p>)}
              </section>

              {/* Review Summary */}
              <section id="review" className="scroll-mt-24">
                {college.review && (
                  <>
                    <h2 className="flex items-center gap-2 !mb-3 text-sky-400"><BarChartHorizontal size={24}/> Review Summary</h2>
                    <p className="leading-relaxed italic">
                      "{college.review}"
                    </p>
                  </>
                )}
              </section>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
