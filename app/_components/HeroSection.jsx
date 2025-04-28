"use client"; // Required for client-side hooks and motion

import React from 'react';
import { motion } from "framer-motion"; // For animations
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { ArrowRight } from 'lucide-react'; // Example icon
import { useRouter } from 'next/navigation'; // Import the hook


// Placeholder Images - Replace with your actual image paths
// Using placehold.co for better visual placeholders
const placeholderImages = [
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
];

// Duplicate images array for seamless looping animation
const doubledImages = [...placeholderImages, ...placeholderImages];

export default function HeroSection() {
  const router = useRouter(); // <<<--- Initialize the router hook
  return (
    // Increased horizontal padding (px-6 sm:px-12 lg:px-20) for centering effect
    // Reduced vertical padding (py-12 md:py-16 lg:py-20) for compactness
    <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 px-6 sm:px-12 lg:px-20 py-12 md:py-16 lg:py-20 items-center">

      {/* Left Side: Text Content */}
      <div className="flex flex-col justify-center text-center md:text-left">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900 leading-tight">
          Try Our College Predictor
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Get a personalized college preference list based on your entrance scores, preferences & career goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3" onClick={() => router.push('/pref-list-generator')}>
            Predict Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3">
            Learn More
          </Button>
        </div>
      </div>

      {/* Right Side: Two Scrolling Image Columns */}
      {/* Reduced height (h-[400px] md:h-[500px]) */}
      <div className="relative grid grid-cols-2 gap-4 h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
        {/* Column 1: Scrolls Up */}
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: ["0%", "-100%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {doubledImages.map((src, index) => (
            <img
              key={`col1-${index}`}
              src={src}
              alt={`College visual ${index % placeholderImages.length + 1}`}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          ))}
        </motion.div>

        {/* Column 2: Scrolls Down */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {doubledImages.map((src, index) => (
            <img
              key={`col2-${index}`}
              src={src}
              alt={`College visual ${index % placeholderImages.length + 1}`}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
