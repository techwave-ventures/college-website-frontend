// Main Page: app/pref-list-generator/page.jsx (or similar route)

"use client";

import { useState } from "react";
import Navbar from "../_components/Navbar"; // Adjust path as needed
import Footer from "../_components/Footer"; // Adjust path as needed
import PreferenceForm from "./components/PreferenceForm"; // Component below
import PreferenceTable from "./components/PreferenceTable"; // Component below
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Import Loader2

export default function PreferenceGeneratorPage() { // Renamed component for clarity
  const [resultData, setResultData] = useState(null); // Holds the API response
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16 md:mt-20">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                Generate Your Personalized College Preference List
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter your details below to get a tailored list based on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* --- CRITICAL: Pass isLoading state down --- */}
              <PreferenceForm
                onResult={setResultData}
                setLoading={setIsLoading} // Pass setter to update state
                setError={setError}       // Pass setter to update state
                isLoading={isLoading}     // Pass current boolean loading state
              />

              {/* Results Section */}
              <div className="mt-10">
                {/* Use isLoading state */}
                {isLoading && (
                  <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                    <p className="ml-4 text-gray-600">Generating your list...</p>
                  </div>
                )}
                {error && (
                   <div className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow">
                     <p className="font-semibold">Error:</p>
                     <p>{error}</p>
                   </div>
                )}
                {/* Display table only when not loading, no error, and data exists */}
                {!isLoading && !error && resultData && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-t pt-6">
                      Your Preference List Results
                    </h2>
                    <PreferenceTable data={resultData} />
                  </>
                )}
                 {/* Initial state message */}
                 {!isLoading && !error && !resultData && (
                     <div className="text-center py-10 text-gray-500 bg-gray-50 p-6 rounded-md border border-dashed">
                         Your generated preference list will appear here after submitting the form.
                     </div>
                 )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Minimal Loader definition if not globally available
// const Loader2 = ({ className = "" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-loader-2 ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> );

