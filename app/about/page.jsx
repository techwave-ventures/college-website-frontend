// File: app/about/page.jsx (or your chosen path)

"use client"; // Can be removed if no client-side hooks are needed later

import React from 'react';
import Link from 'next/link'; // For internal links
import Navbar from "../_components/Navbar"; // Adjust path as needed
import Footer from "../_components/Footer"; // Adjust path as needed
import { GraduationCap, Target, Lightbulb, Users, Compass } from 'lucide-react'; // Icons
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button

// export const metadata = {
//   title: 'About Campus Sathi | Your MHT-CET Admission Guide',
//   description: 'Learn about Campus Sathi\'s mission to simplify the MHT-CET admission journey for students across Maharashtra with data-driven insights and personalized guidance.',
//   // You can add other metadata fields here too:
//   keywords: ['MHT-CET', 'About Campus Sathi', 'College Counseling Maharashtra', 'TechWave Ventures'],
// };

export default function AboutPage() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50"> {/* Subtle gradient background */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center pt-8 pb-12 md:pt-12 md:pb-16 border-b border-gray-200">
           <GraduationCap className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            About Campus Sathi
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            Your trusted companion for navigating the complexities of college admissions in Maharashtra, powered by TechWave Ventures.
          </p>
        </section>

        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg mt-12 border border-gray-200">

          {/* Our Mission */}
          <section className="mb-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <Target className="h-16 w-16 text-indigo-500 bg-indigo-100 p-3 rounded-full" />
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                    Navigating the MHT-CET counselling process and choosing the right college can be overwhelming. Campus Sathi was founded with a clear mission: to simplify the admission journey for students across Maharashtra. We aim to empower you with data-driven insights, personalized guidance, and reliable information, helping you make confident decisions about your future.
                </p>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1: Pref List Generator */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                 <Lightbulb className="h-10 w-10 text-green-500 mb-3" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Preference List Generator</h3>
                <p className="text-gray-600 leading-relaxed">
                  Input your MHT-CET percentile, category, preferred branches and locations to generate a tailored list of potential colleges based on historical data and trends.
                </p>
              </div>
              {/* Feature 2: College Exploration */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <Compass className="h-10 w-10 text-blue-500 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Explore Colleges & Branches</h3>
                  <p className="text-gray-600 leading-relaxed">
                      Access information about various colleges across Maharashtra affiliated with MHT-CET. Explore details about available branches, potential cutoffs (based on past data), and more to inform your choices.
                  </p>
              </div>
              {/* Feature 3: Blog & Updates */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6 4h6" /> </svg> {/* Simple Blog Icon */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">MHT-CET Updates & Guides</h3>
                  <p className="text-gray-600 leading-relaxed">
                      Stay informed with our blog section dedicated to MHT-CET. Find detailed guides on the counselling process, document checklists, FAQs, and other crucial updates to help you stay ahead.
                  </p>
              </div>
               {/* Feature 4: Counseling Plans (Optional) */}
               <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                   <Users className="h-10 w-10 text-orange-500 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Guidance (Our Plans)</h3>
                  <p className="text-gray-600 leading-relaxed">
                      We offer various counseling plans providing different levels of access to tools like the Preference List Generator and potentially personalized support from experienced counselors.
                  </p>
              </div>
            </div>
          </section>

          {/* Our Approach */}
          <section className="mb-12 text-center">
             <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Our Approach</h2>
             <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
               We believe in a data-informed, student-centric approach. By leveraging past admission trends and your unique profile, we aim to provide realistic possibilities and actionable insights. Our goal is to demystify the process, reduce stress, and help you secure admission to the best possible college based on your merit and preferences.
             </p>
          </section>

          {/* Team Section (Placeholder) */}
          {/*
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">Meet the Team</h2>
            <p className="text-center text-gray-600">
              [Information about the team behind Campus Sathi / TechWave Ventures can go here.]
            </p>
            {/* Add team member cards if desired *}
          </section>
          */}

          {/* Call to Action */}
          <section className="mt-10 pt-8 border-t border-gray-300 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Explore our tools, read our guides, or sign up to get personalized insights for your MHT-CET admission process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/ExploreColleges">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Colleges</Button>
                </Link>
                 <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">Sign Up Now</Button>
                </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
