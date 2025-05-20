// app/ExploreColleges/page.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, MapPin, Book, Building, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main-z0vm.onrender.com/apiv1";
const FALLBACK_IMAGE_URL = "https://placehold.co/600x400/e2e8f0/cbd5e1?text=College";

// --- College Card Component ---
function CollegeCard({ college }) {
  const collegeLink = college.slug
    ? `/college/${college.slug}`
    : (college._id ? `/college/id/${college._id}` : "#");

  if (!college.slug && college._id) {
    console.warn(`College "${college.name}" (ID: ${college._id}) is missing a slug. Falling back to ID-based link: ${collegeLink}. Consider adding slugs for all colleges.`);
  } else if (!college.slug && !college._id) {
    console.warn(`College "${college.name}" is missing both slug and _id. Card will link to '#'.`);
  }

  return (
    <Link href={collegeLink} passHref legacyBehavior>
      <a className="block group">
        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200 group-hover:border-gray-800">
          <CardHeader className="p-0 relative">
            <img
              src={college.avatarImage?.imageUrl || FALLBACK_IMAGE_URL}
              alt={`${college.name} Campus`}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
            />
            {college.type && (
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100">
                {college.type}
              </span>
            )}
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <CardTitle className="text-base font-semibold mb-1 group-hover:text-black transition-colors">{college.name}</CardTitle>
              <CardDescription className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                <MapPin size={12} /> {college.location || "Location N/A"}
              </CardDescription>
              <p className="text-xs text-gray-500">DTE: {college.dteCode || "N/A"}</p>
            </div>
            {college.courses?.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500 gap-1">
                <Book size={12}/> {college.courses.length} Course{college.courses.length > 1 ? 's' : ''} Available
              </div>
            )}
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

// --- Main Explore Colleges Page Component ---
export default function ExploreColleges() {
  const [exams, setExams] = useState([]);
  const [allColleges, setAllColleges] = useState([]); // Stores all colleges fetched once
  const [filteredColleges, setFilteredColleges] = useState([]); // Colleges filtered by exam (or all if no exam)
  const [selectedExamId, setSelectedExamId] = useState(null); // Initially no exam selected
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isLoadingColleges, setIsLoadingColleges] = useState(true); // True initially for fetching all colleges
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // --- Fetch Exams (runs once) ---
  useEffect(() => {
    const fetchExams = async () => {
      setIsLoadingExams(true);
      setError(null); // Clear previous errors
      try {
        const res = await axios.get(`${API_BASE_URL}/exam`);
        setExams(res.data.exams || []);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("Failed to load exams list.");
        setExams([]);
      } finally {
        setIsLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // --- Fetch ALL Colleges (runs once) ---
  useEffect(() => {
    const fetchAllCollegesData = async () => {
      setIsLoadingColleges(true);
      setError(null); // Clear previous errors
      try {
        const collegeRes = await axios.get(`${API_BASE_URL}/college`);
        const allFetchedColleges = collegeRes.data.colleges || [];
        setAllColleges(allFetchedColleges);
        setFilteredColleges(allFetchedColleges); // Initially, display all colleges
        console.log("Fetched all colleges:", allFetchedColleges.length);
      } catch (err) {
        console.error("Error fetching all colleges:", err);
        setError("Failed to load college data.");
        setAllColleges([]);
        setFilteredColleges([]);
      } finally {
        setIsLoadingColleges(false);
      }
    };
    fetchAllCollegesData();
  }, []);

  // --- Filter Colleges when selectedExamId changes ---
  useEffect(() => {
    if (!selectedExamId) {
      // If no exam is selected (or deselected), show all colleges
      setFilteredColleges(allColleges);
      return;
    }

    // If an exam is selected, filter from the already fetched allColleges
    if (allColleges.length > 0) {
      setIsLoadingColleges(true); // Indicate filtering is in progress
      const filterByExam = async () => {
        setError(null); // Clear previous errors
        try {
          console.log(`Fetching exam details for ID: ${selectedExamId} to filter colleges.`);
          const examRes = await axios.get(`${API_BASE_URL}/exam/${selectedExamId}`);
          const collegeIdsInExam = new Set(examRes.data.exam?.colleges?.map(c => c._id) || []);
          const collegesForSelectedExam = allColleges.filter(college =>
            collegeIdsInExam.has(college._id)
          );
          setFilteredColleges(collegesForSelectedExam);
          console.log(`Filtered to ${collegesForSelectedExam.length} colleges for exam ${selectedExamId}`);
        } catch (err) {
          console.error("Error fetching exam details for filtering:", err);
          setError(`Failed to load colleges for the selected exam.`);
          setFilteredColleges([]); // Show no colleges if exam details fail
        } finally {
          setIsLoadingColleges(false);
        }
      };
      filterByExam();
    }
  }, [selectedExamId, allColleges]); // Re-run when exam selection changes or allColleges data is ready

  // --- Client-Side Search Filtering on top of filteredColleges ---
  const displayedColleges = useMemo(() => {
    let collegesToDisplay = [...filteredColleges];
    if (searchTerm) {
      collegesToDisplay = collegesToDisplay.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (college.location && college.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (college.dteCode && college.dteCode.toString().includes(searchTerm))
      );
    }
    return collegesToDisplay;
  }, [searchTerm, filteredColleges]);

  const handleExamClick = (examId) => {
    if (selectedExamId === examId) { // If clicking the same exam again, deselect it to show all
        setSelectedExamId(null);
    } else {
        setSelectedExamId(examId);
    }
    setSearchTerm("");
    setShowFilters(false);
  };

  // Determine what message to show if no colleges are displayed
  let noResultsMessage = "No colleges available at the moment. Please check back later.";
  if (selectedExamId && !isLoadingColleges && displayedColleges.length === 0 && !error) {
    noResultsMessage = "No colleges match your current filters for the selected exam.";
  } else if (!selectedExamId && searchTerm && displayedColleges.length === 0 && !error) {
    noResultsMessage = "No colleges match your search term. Try a different search.";
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 py-8">
            <aside className={`lg:w-1/4 xl:w-1/5 lg:sticky lg:top-24 self-start p-6 bg-white rounded-lg shadow-md ${showFilters ? 'block fixed inset-0 z-40 overflow-y-auto pt-20 lg:pt-6' : 'hidden'} lg:block`}>
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h3 className="text-lg font-semibold">Filters & Exams</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>Close</Button>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">Select Exam</h4>
                {isLoadingExams ? (
                  <div className="flex justify-center p-2"><Loader2 className="animate-spin text-gray-400 h-6 w-6" /></div>
                ) : error && !exams.length ? ( // Check if error is specifically for exams
                  <p className="text-xs text-red-500">{error}</p>
                ) : (
                  <div className="space-y-2">
                    {exams.map((exam) => (
                      <Button
                        key={exam._id}
                        variant={selectedExamId === exam._id ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleExamClick(exam._id)}
                        className={`w-full justify-start text-left h-auto py-1.5 px-3 ${selectedExamId === exam._id ? 'bg-gray-200 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        {exam.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              {/* Placeholder Filters */}
              <div className="space-y-4 pt-4 border-t">
                {/* ... your filter inputs ... */}
              </div>
            </aside>

            <main className="flex-grow lg:w-3/4 xl:w-4/5">
              <div className="mb-4 lg:hidden text-right">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                  <Filter size={16} className="mr-1"/> Show Filters & Exams
                </Button>
              </div>
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search colleges by name, location, DTE..."
                  className="pl-10 pr-4 py-2 text-base h-12 rounded-lg border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoadingColleges && !allColleges.length} // Disable if initially loading all colleges
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <div>
                {isLoadingColleges && filteredColleges.length === 0 ? ( // Show loader if loading and no colleges yet displayed
                  <div className="flex justify-center items-center p-10 min-h-[300px]"><Loader2 className="animate-spin text-black h-12 w-12" /></div>
                ) : error ? ( // Display error if one occurred (and not initial exam load error)
                  <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">{error}</div>
                ) : displayedColleges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedColleges.map((college) => (
                      <CollegeCard key={college._id} college={college} />
                    ))}
                  </div>
                ) : ( // No results message
                  <div className="text-center py-10 text-gray-500 bg-gray-100 p-6 rounded-md">
                    {noResultsMessage}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
