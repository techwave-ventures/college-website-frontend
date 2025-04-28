// pages/coming-soon.jsx (or app/coming-soon/page.jsx depending on your Next.js setup)
"use client"; // Add if using App Router

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui
import { Hourglass } from 'lucide-react'; // Icons for visual interest

export default function ComingSoonPage() {

  // Removed useState for email, isSubmitting, message
  // Removed handleEmailSubmit function

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-center px-4 py-12">
      {/* Main Content Container */}
      <div className="max-w-md w-full">

        {/* Icon / Illustration */}
        <div className="mb-8 text-gray-400">
          <Hourglass size={64} className="mx-auto animate-spin-slow" /> {/* Simple animation */}
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Coming Soon!
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed"> {/* Increased margin-bottom */}
          We're working hard to bring you something amazing. Stay tuned for exciting updates and new features!
        </p>

        {/* Removed Email Notification Form */}

        {/* Back to Home Button */}
        <Link href="/">
          <Button variant="outline">
            Go Back Home
          </Button>
        </Link>

      </div>

      {/* Footer (Optional Minimal) */}
      <footer className="absolute bottom-4 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Campus Sathi. All rights reserved.
      </footer>

      {/* Add custom animation CSS if needed */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}