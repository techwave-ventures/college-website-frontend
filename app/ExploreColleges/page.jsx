// "use client";

// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Link from "next/link"; // Import Link for college card navigation
// import Footer from "../_components/Footer"; // Adjust path if needed
// import Navbar from "../_components/Navbar"; // Adjust path if needed
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Loader2, Search, MapPin, Book, Building, Filter } from "lucide-react"; // Added more icons

// // Define the API base URL (use environment variable in production)
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main.onrender.com/apiv1";
// // Fallback image if college avatar is missing
// const FALLBACK_IMAGE_URL = "https://placehold.co/600x400/e2e8f0/cbd5e1?text=College";

// // --- College Card Component ---
// function CollegeCard({ college }) {
//   // Removed router usage from card, navigation handled by Link wrapper
//   return (
//     <Link href={`/college/${college._id}`} passHref legacyBehavior>
//       <a className="block group"> {/* Make the link the clickable area */}
//         <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200 group-hover:border-gray-800">
//           <CardHeader className="p-0 relative">
//             <img
//               src={college.avatarImage?.imageUrl || FALLBACK_IMAGE_URL}
//               alt={`${college.name} Campus`}
//               className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" // Subtle zoom on hover
//               onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
//             />
//             {/* Optional: Add overlay or badge */}
//             {/* <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity"></div> */}
//              {college.type && (
//                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100">
//                      {college.type}
//                  </span>
//              )}
//           </CardHeader>
//           <CardContent className="p-4 flex-grow flex flex-col justify-between">
//             <div>
//               <CardTitle className="text-base font-semibold mb-1 group-hover:text-black transition-colors">{college.name}</CardTitle> {/* Adjusted size */}
//               <CardDescription className="text-xs text-gray-600 flex items-center gap-1 mb-2"> {/* Adjusted size */}
//                 <MapPin size={12} /> {college.location || "Location N/A"}
//               </CardDescription>
//               <p className="text-xs text-gray-500">DTE: {college.dteCode || "N/A"}</p>
//             </div>
//              {/* Example: Show number of courses */}
//              {college.courses?.length > 0 && (
//                 <div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500 gap-1">
//                     <Book size={12}/> {college.courses.length} Course{college.courses.length > 1 ? 's' : ''} Available
//                 </div>
//              )}
//           </CardContent>
//         </Card>
//       </a>
//     </Link>
//   );
// }

// // --- Main Explore Colleges Page Component ---
// export default function ExploreColleges() {
//   const [exams, setExams] = useState([]);
//   const [allColleges, setAllColleges] = useState([]);
//   const [filteredColleges, setFilteredColleges] = useState([]);
//   const [selectedExamId, setSelectedExamId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoadingExams, setIsLoadingExams] = useState(true);
//   const [isLoadingColleges, setIsLoadingColleges] = useState(false);
//   const [error, setError] = useState(null);
//   const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle

//   // --- Fetch Exams ---
//   useEffect(() => {
//     const fetchExams = async () => {
//       setIsLoadingExams(true);
//       setError(null);
//       try {
//         const res = await axios.get(`${API_BASE_URL}/exam`);
//         setExams(res.data.exams || []);
//       } catch (err) {
//         console.error("Error fetching exams:", err);
//         setError("Failed to load exams.");
//         setExams([]);
//       } finally {
//         setIsLoadingExams(false);
//       }
//     };
//     fetchExams();
//   }, []);

//   // --- Fetch Colleges & Filter by Exam ---
//   useEffect(() => {
//     if (!selectedExamId) {
//       // Optionally clear colleges or show all if desired when no exam is selected
//       setFilteredColleges([]); // Clear displayed colleges
//       setAllColleges([]); // Clear stored colleges
//       return;
//     }

//     const fetchCollegesAndFilter = async () => {
//       setIsLoadingColleges(true);
//       setError(null);
//       setFilteredColleges([]); // Clear previous results while loading
//       try {
//         // Fetch all colleges first
//         const collegeRes = await axios.get(`${API_BASE_URL}/college`);
//         const allFetchedColleges = collegeRes.data.colleges || [];
//         setAllColleges(allFetchedColleges); // Store all

//         // Fetch exam details to get associated college IDs
//         const examRes = await axios.get(`${API_BASE_URL}/exam/${selectedExamId}`);
//         const collegeIdsInExam = new Set(examRes.data.exam?.colleges?.map(c => c._id) || []);

//         // Filter all colleges based on the IDs
//         const collegesForSelectedExam = allFetchedColleges.filter(college =>
//           collegeIdsInExam.has(college._id)
//         );
//         setFilteredColleges(collegesForSelectedExam); // Set the filtered list

//       } catch (err) {
//         console.error("Error fetching colleges or exam details:", err);
//         setError("Failed to load colleges for the selected exam.");
//         setAllColleges([]);
//         setFilteredColleges([]);
//       } finally {
//         setIsLoadingColleges(false);
//       }
//     };

//     fetchCollegesAndFilter();
//   }, [selectedExamId]);

//   // --- Client-Side Search Filtering ---
//   const displayedColleges = useMemo(() => {
//     // Start with the list already filtered by the selected exam
//     let collegesToDisplay = [...filteredColleges];

//     // Apply search term filter if present
//     if (searchTerm) {
//       collegesToDisplay = collegesToDisplay.filter(college =>
//         college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (college.location && college.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (college.dteCode && college.dteCode.toString().includes(searchTerm))
//       );
//     }

//     // --- Placeholder for additional client-side filters ---
//     // Example: Filter by type (if type filter state exists)
//     // if (selectedTypeFilter) {
//     //   collegesToDisplay = collegesToDisplay.filter(c => c.type === selectedTypeFilter);
//     // }
//     // --- End Placeholder ---

//     return collegesToDisplay;
//   }, [searchTerm, filteredColleges]); // Recalculate when search or exam-filtered list changes

//   const handleExamClick = (examId) => {
//     setSelectedExamId(examId);
//     setSearchTerm(""); // Reset search when changing exams
//     // Reset other filters here if implemented
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100"> {/* Lighter background */}
//       <Navbar />

//       {/* Add top margin to account for fixed Navbar */}
//       <div className="flex-grow pt-16 md:pt-20">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="flex flex-col lg:flex-row gap-8 py-8">

//             {/* --- Sidebar (Filters/Exams) --- */}
//             {/* Use 'lg:sticky' to make it sticky on large screens */}
//             {/* Use 'lg:block' and conditional rendering for mobile toggle */}
//             <aside className={`lg:w-1/4 xl:w-1/5 lg:sticky lg:top-24 self-start p-6 bg-white rounded-lg shadow-md ${showFilters ? 'block' : 'hidden'} lg:block`}>
//               <div className="flex justify-between items-center mb-4 lg:hidden">
//                  <h3 className="text-lg font-semibold">Filters & Exams</h3>
//                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>Close</Button>
//               </div>

//               {/* Exam Selection */}
//               <div className="mb-6">
//                 <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Select Exam</h4>
//                 {isLoadingExams ? (
//                   <div className="flex justify-center p-2"><Loader2 className="animate-spin text-gray-400 h-6 w-6" /></div>
//                 ) : error && !exams.length ? (
//                   <p className="text-xs text-red-500">{error}</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {exams.map((exam) => (
//                       <Button
//                         key={exam._id}
//                         variant={selectedExamId === exam._id ? "secondary" : "ghost"} // Use secondary for selected state
//                         size="sm"
//                         onClick={() => handleExamClick(exam._id)}
//                         className={`w-full justify-start text-left h-auto py-1.5 px-3 ${selectedExamId === exam._id ? 'bg-gray-200 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
//                       >
//                         {exam.name}
//                       </Button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* --- Placeholder Filters --- */}
//               <div className="space-y-4 pt-4 border-t">
//                  <h4 className="font-semibold mb-3 text-gray-700">Filters</h4>
//                  <div>
//                      <Label htmlFor="filter-place" className="text-sm font-medium">Location</Label>
//                      <Input id="filter-place" placeholder="e.g., Pune" className="mt-1 h-9 text-sm" disabled={!selectedExamId || isLoadingColleges} />
//                  </div>
//                  <div>
//                      <Label htmlFor="filter-course" className="text-sm font-medium">Course Type</Label>
//                      <Input id="filter-course" placeholder="e.g., Engineering" className="mt-1 h-9 text-sm" disabled={!selectedExamId || isLoadingColleges} />
//                  </div>
//                  {/* Add more filters like Fees, Type etc. */}
//                  <Button variant="outline" size="sm" className="w-full mt-2" disabled={!selectedExamId || isLoadingColleges}>Apply Filters</Button>
//               </div>
//             </aside>

//             {/* --- Main Content Area (Search + Colleges Grid) --- */}
//             <main className="flex-grow lg:w-3/4 xl:w-4/5">
//               {/* Mobile Filter Button */}
//                <div className="mb-4 lg:hidden text-right">
//                  <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
//                     <Filter size={16} className="mr-1"/> Show Filters & Exams
//                  </Button>
//                </div>

//               {/* Search Bar */}
//               <div className="relative mb-6">
//                 <Input
//                   type="text"
//                   placeholder="Search colleges by name, location, DTE..."
//                   className="pl-10 pr-4 py-2 text-base h-12 rounded-lg border-gray-300 focus:border-gray-800 focus:ring-gray-800" // Slightly different style
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   disabled={!selectedExamId || isLoadingColleges} // Disable if no exam selected or loading
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               </div>

//               {/* College Grid Area */}
//               <div>
//                 {isLoadingColleges ? (
//                   <div className="flex justify-center items-center p-10 min-h-[300px]">
//                     <Loader2 className="animate-spin text-black h-12 w-12" />
//                   </div>
//                 ) : error && !displayedColleges.length ? (
//                     <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>
//                 ) : selectedExamId && displayedColleges.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {displayedColleges.map((college) => (
//                       <CollegeCard key={college._id} college={college} />
//                     ))}
//                   </div>
//                 ) : selectedExamId && !isLoadingColleges ? (
//                   // No results found for the selected exam (after filtering)
//                   <div className="text-center py-10 text-gray-500 bg-gray-100 p-6 rounded-md">
//                     No colleges match your current filters for the selected exam. Try adjusting your search or filters.
//                   </div>
//                 ) : (
//                    // Initial state - No exam selected
//                    <div className="text-center py-10 text-gray-500 bg-gray-100 p-6 rounded-md">
//                      Please select an entrance exam from the sidebar to view associated colleges.
//                    </div>
//                 )}
//               </div>
//             </main>

//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
