"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Image URLs (Replace with actual images)
const images = [
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
    "/images.jpg",
];

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 mt-mobile">
      {/* Left Side: Text */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Unlock Your Engineering Future</h1>
        <p className="text-gray-600 mb-6">
          Get personalized college recommendations based on your entrance scores, preferences, and career goals. Start your journey to the perfect engineering college today!
        </p>
        <div className="flex space-x-4">
          <Button className="bg-black text-white">Search</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>

      {/* Right Side: Two Scrolling Columns */}
      <div className="grid grid-cols-2 gap-4 h-96 overflow-hidden">
        {/* Column 1: Scrolls Up */}
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: ["0%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...images, ...images].map((src, index) => (
            <img key={index} src={src} alt="College" className="w-full rounded-lg" />
          ))}
        </motion.div>

        {/* Column 2: Scrolls Down */}
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: ["-100%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...images, ...images].map((src, index) => (
            <img key={index} src={src} alt="College" className="w-full rounded-lg" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
