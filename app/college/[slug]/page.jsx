// File: app/college/[slug]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../_components/Navbar'; // Adjust path
import Footer from '../../_components/Footer';   // Adjust path
import CollegeDetailSidebar from '../../_components/CollegeDetailSidebar'; // Ensure this path is correct
import { Loader2, MapPin, CalendarDays, Building, GraduationCap, Briefcase, Info, Image as ImageIcon, CheckCircle, Book, Users, BarChartHorizontal, DollarSign, Youtube } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main.onrender.com/apiv1"; // Ensure this is set in your environment variables
const FALLBACK_IMAGE_URL = "https://placehold.co/600x400/e2e8f0/cbd5e1?text=College+Image"; // Light theme placeholder



// --- Add this generateMetadata function ---
export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return {
      title: 'College Details',
      description: 'Detailed information about engineering colleges in Maharashtra.',
    };
  }

  try {
    // Fetch minimal data needed for the title/description
    // This call should be quick and only fetch name/location or a short description
    const response = await axios.get(`${API_BASE_URL}/college/slug/${slug}`); // Or your Gemini endpoint if that's primary
    const college = response.data?.college;

    if (college) {
      return {
        title: `${college.name} | Details, Courses & Cutoffs`,
        description: `Explore details for ${college.name}, ${college.location}. Find information on courses, admission process, fees, placements, and more.`,
        // openGraph: {
        //   title: `${college.name} | Campus Sathi`,
        //   description: `Details for ${college.name}.`,
        //   images: [{ url: college.avatarImage?.imageUrl || 'default-og-image.png' }],
        // },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata for college slug:", slug, error);
    // Fallback metadata if API call fails
    return {
      title: 'College Not Found',
      description: 'The requested college details could not be found.',
    };
  }

  // Default fallback if no college data
  return {
    title: 'College Details',
    description: 'Detailed information about colleges for MHT-CET aspirants.',
  };
}
// --- End generateMetadata function ---




// Define sections for the sidebar and content linking
const pageSections = [
    { id: "about-college", title: "About College" },
    { id: "admission-process", title: "Admission Process" },
    { id: "courses-offered", title: "Courses & Branches" },
    { id: "fees", title: "Fee Structure" },
    { id: "placements", title: "Placement Highlights" },
    { id: "infrastructure", title: "Infrastructure" },
    { id: "gallery", title: "Gallery" },
    { id: "videos", title: "Videos" },
    { id: "review", title: "Review Summary" },
];

export default function CollegeDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleFetchedImages, setGoogleFetchedImages] = useState([]);
  const [loadingGoogleImages, setLoadingGoogleImages] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingYoutubeVideos, setLoadingYoutubeVideos] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("College identifier (slug) not found in URL.");
      setLoading(false);
      return;
    }

    const fetchCollegeData = async () => {
      setLoading(true);
      setGoogleFetchedImages([]);
      setYoutubeVideos([]);
      setError(null);
      try {
        // const response = await axios.get(`${API_BASE_URL}/college/slug/${slug}`);
        const collegeIdentifier = encodeURIComponent(slug); // Or collegeNameOrSlugFromParams if that's your variable

        const response = await axios.get(`${API_BASE_URL}/gemini/college-info/${collegeIdentifier}`);        
        if (response.data.success && response.data.college) {
          const fetchedCollege = response.data.college;
          setCollege(fetchedCollege);
          console.log("Fetched College Data:", fetchedCollege);

          if (!fetchedCollege.images || fetchedCollege.images.length === 0) {
            setLoadingGoogleImages(true);
            try {
              const imageSearchResponse = await axios.get(`${API_BASE_URL}/college/college-images/search?collegeName=${encodeURIComponent(fetchedCollege.name)}`);
              if (imageSearchResponse.data.success && imageSearchResponse.data.images) {
                setGoogleFetchedImages(imageSearchResponse.data.images);
              }
            } catch (imageError) {
              console.error("Error fetching Google images via Next.js API:", imageError.response?.data || imageError.message);
            } finally {
              setLoadingGoogleImages(false);
            }
          }
          // Fetch YouTube videos
          setLoadingYoutubeVideos(true);
          try {
            const videoSearchResponse = await axios.get(`${API_BASE_URL}/college/college-videos/search?collegeName=${encodeURIComponent(fetchedCollege.name)}`);
            if (videoSearchResponse.data.success && videoSearchResponse.data.videos) {
                setYoutubeVideos(videoSearchResponse.data.videos);
            }
          } catch (videoError) {
            console.error("Error fetching YouTube videos via Next.js API:", videoError.response?.data || videoError.message);
          } finally {
            setLoadingYoutubeVideos(false);
          }
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
  }, [slug]);


  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Reverted to Light theme */}
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20">
            <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
          </main>
          <Footer />
        </div>
      );
  }
  if (error) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Reverted to Light theme */}
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20 px-4">
            <div className="text-center text-red-600 bg-red-100 p-6 rounded-lg shadow border border-red-200"> {/* Light theme error card */}
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
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Reverted to Light theme */}
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-20">
            <p className="text-xl text-gray-500">College not found.</p>
          </main>
          <Footer />
        </div>
      );
  }

  const displayImages = (college?.images && college.images.length > 0) ? college.images : googleFetchedImages;
  const displayVideos = youtubeVideos;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Light theme background */}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <section className="mb-8 md:mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white p-6 rounded-lg shadow-md border border-gray-200"> {/* Light theme card */}
          <img
            src={college.avatarImage?.imageUrl || FALLBACK_IMAGE_URL}
            alt={`${college.name} Logo`}
            className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-md border bg-white p-1"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{college.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-gray-600"> {/* Light theme text */}
              <span className="flex items-center gap-1"><MapPin size={14} /> {college.location || 'N/A'}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} /> Est. {college.year || 'N/A'}</span>
              <span className="flex items-center gap-1"><Building size={14} /> {college.type || 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">DTE Code: {college.dteCode}</p>
            {college.affiliation && <Badge variant="secondary" className="mt-2">{college.affiliation}</Badge>} {/* Default secondary badge */}
          </div>
        </section>

        <div className="flex flex-col md:flex-row">
          {/* Ensure CollegeDetailSidebar is styled for light theme */}
          <CollegeDetailSidebar sections={pageSections} />

          <Card className="flex-grow md:pl-4 p-6 md:p-8 shadow-lg border border-gray-200 bg-white"> {/* Light theme card */}
            {/* Removed prose-invert, default prose text is dark */}
            <CardContent className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700">

              {/* About Section */}
              <section id="about-college" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 !mt-0 text-indigo-600"> {/* Light theme icon color */}
                    <Info size={24} /> About {college.name}
                </h2>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {college.desc || 'No description available.'}
                </p>
              </section>

              {/* Admission Process */}
              <section id="admission-process" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><GraduationCap size={24} /> Admission Process</h2>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {college.admissionProcess || 'Admission process details not provided.'}
                </p>
              </section>

              {/* Courses Offered */}
              <section id="courses-offered" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><Book size={24} /> Courses & Branches Offered</h2>
                  {college.courses && college.courses.length > 0 ? (
                    <div className="space-y-4 not-prose">
                      {college.courses.map((course) => (
                        <div key={course._id || course.name} className="p-3 bg-gray-50 rounded-md border border-gray-200"> {/* Light theme inner card */}
                          <h3 className="text-md font-semibold text-gray-800">{course.name} <span className="text-sm font-normal text-gray-500">({course.duration || 'N/A'})</span></h3>
                          {course.branches && course.branches.length > 0 ? (
                            <ul className="list-disc list-inside pl-4 space-y-1 mt-1 text-sm">
                              {course.branches.map((branch) => (
                                <li key={branch._id || branch.bName} className="text-gray-600">
                                  {branch.bName}
                                </li>
                              ))}
                            </ul>
                          ) : <p className="text-xs text-gray-500 italic mt-1">No specific branches listed.</p>}
                        </div>
                      ))}
                    </div>
                  ) : (<p className="italic text-gray-500">No specific course information available.</p>)}
              </section>

              {/* Fee Structure */}
              <section id="fees" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><DollarSign size={24}/> Fee Structure</h2>
                  {college.courses && college.courses.some(c => c.fees && c.fees.length > 0) ? (
                    <div className="space-y-3 not-prose">
                      {college.courses.map(course => course.fees && course.fees.length > 0 && (
                        <div key={`fee-${course._id || course.name}`}>
                          <h4 className="font-medium text-gray-700 text-sm">{course.name} Fees:</h4>
                          <ul className="list-disc list-inside pl-4 text-xs text-gray-600">
                            {course.fees.map((fee, idx) => (
                              <li key={idx}>{fee.category}: ₹{fee.amt?.toLocaleString('en-IN') || 'N/A'}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="italic text-gray-500">Fee structure not available.</p>)}
              </section>

              {/* Placement Highlights */}
              <section id="placements" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><Briefcase size={24}/> Placement Highlights</h2>
                <div className="space-y-1 text-gray-700 not-prose text-sm">
                  {college.courses && college.courses.some(c => c.placements) ? (
                     college.courses.map(course => course.placements && (
                        <div key={`placement-${course._id || course.name}`} className="mb-2 pb-1 border-b border-gray-100 last:border-b-0 last:pb-0"> {/* Light theme border */}
                             <h4 className="font-medium text-gray-700">{course.name} Placements:</h4>
                             <p><span className="font-semibold">Average Package:</span> ₹{course.placements.averageSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                             <p><span className="font-semibold">Highest Package:</span> ₹{course.placements.highestSalary?.toLocaleString('en-IN') || 'N/A'} LPA</p>
                        </div>
                     ))
                  ) : (<p className="italic text-gray-500">Overall placement data not specified at course level.</p>)}
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
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><Users size={24}/> Infrastructure</h2>
                  {college.infrastructure && college.infrastructure.length > 0 ? (
                    <ul className="space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 not-prose text-sm">
                      {college.infrastructure.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>{item}
                        </li>
                      ))}
                    </ul>
                  ) : (<p className="italic text-gray-500">Infrastructure details not provided.</p>)}
              </section>

              {/* Image Gallery Section */}
              <section id="gallery" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><ImageIcon size={24}/> Gallery</h2>
                  {loadingGoogleImages && ( <div className="flex justify-center items-center p-4"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /><p className="ml-2 text-sm text-gray-500">Loading images...</p></div> )}
                  {!loadingGoogleImages && displayImages && displayImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 not-prose">
                      {displayImages.map((image, index) => (
                        <div key={image._id || image.imageUrl || `gimg-${index}`} className="relative w-full overflow-hidden rounded-md border border-gray-200 group cursor-pointer hover:shadow-lg" style={{ paddingTop: '75%' /* 3/4 = 75% for 4:3 */ }} onClick={() => window.open(image.imageUrl || image, '_blank')}>
                          <img
                            src={image.imageUrl || image || FALLBACK_IMAGE_URL}
                            alt={`${college.name} Gallery Image ${index + 1}`}
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : ( !loadingGoogleImages && <p className="italic text-gray-500">No gallery images available.</p> )}
              </section>

              {/* YouTube Videos Section */}
              <section id="videos" className="scroll-mt-24 mb-10">
                <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><Youtube size={24}/> Videos</h2>
                {loadingYoutubeVideos && ( <div className="flex justify-center items-center p-4"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /><p className="ml-2 text-sm text-gray-500">Loading videos...</p></div> )}
                {!loadingYoutubeVideos && displayVideos && displayVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
                        {displayVideos.map((video) => (
                            <div key={video.videoId} className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                {/* --- MODIFICATION: Apply 4:3 aspect ratio --- */}
                                <div className="aspect-w-4 aspect-h-3 mb-2"> {/* Changed from aspect-w-16 aspect-h-9 */}
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.videoId}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded"
                                    ></iframe>
                                </div>
                                {/* --- END MODIFICATION --- */}
                                <h4 className="text-sm font-semibold text-gray-800 truncate" title={video.title}>{video.title}</h4>
                            </div>
                        ))}
                    </div>
                ) : ( !loadingYoutubeVideos && <p className="italic text-gray-500">No relevant videos found for this college.</p> )}
              </section>

              {/* Review Summary */}
              <section id="review" className="scroll-mt-24">
                {college.review && (
                  <> <h2 className="flex items-center gap-2 !mb-3 text-indigo-600"><BarChartHorizontal size={24}/> Review Summary</h2> <p className="leading-relaxed italic"> "{college.review}" </p> </>
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
