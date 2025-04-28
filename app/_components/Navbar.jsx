"use client";

import { useState } from "react";
import Link from "next/link"; // Use Next.js Link for client-side navigation
import { useRouter } from "next/navigation"; // Keep for button push if needed
import { IoMdMenu, IoMdClose } from "react-icons/io"; // Icons for mobile menu
import { motion, AnimatePresence } from "framer-motion"; // For mobile menu animation
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button

// Placeholder Logo SVG - Replace with your actual Logo component or image
const Logo = () => (
  <svg height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Changed fill to black */}
    <circle cx="50" cy="50" r="45" fill="#000000" />
    <text x="50" y="60" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">C</text> {/* Example initial */}
  </svg>
);

// Define Navigation Links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" }, // Link to /about page (create this page)
  { href: "/ExploreColleges", label: "Explore Colleges" }, // Link to /explore page (create this page)
  { href: "/blogs", label: "Blogs" }, // Link to /blogs page (create this page)
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (e, href) => {
      // If it's a "coming soon" link, prevent default navigation for now
      if (href === '/about' || href === '/blogs') {
          e.preventDefault();
          router.push('/coming-soon');
      }
      setMenuOpen(false); // Close menu on any link click
  }

  const handleSignUp = () => {
      setMenuOpen(false);
      router.push("/auth/signup");
  }


  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {/* Increased padding slightly */}
      <div className="container mx-auto flex justify-between items-center p-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
           <Logo />
           <span className="text-xl font-bold text-gray-800 hidden sm:inline">Campus Sathi</span> {/* Optional: Add Name */}
        </Link>

        {/* Desktop Navigation */}
        {/* Increased spacing (space-x-8) */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)} // Handle coming soon
              // Changed hover text color to black
              className="hover:text-black hover:underline underline-offset-4 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Sign Up Button (Desktop) */}
        <Button
            onClick={handleSignUp}
            className="hidden md:inline-flex bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md" // Added rounded-md
        >
          Sign Up
        </Button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)} // Toggle menu
          // Changed hover text color to black
          className="md:hidden text-2xl text-gray-700 hover:text-black transition-colors"
          aria-label="Toggle menu" // Accessibility
        >
          {menuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} // Start slightly above and faded out
            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
            exit={{ opacity: 0, y: -20 }} // Animate out
            transition={{ duration: 0.2 }}
            // Changed position to absolute below navbar, full width
            className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col p-6 md:hidden"
          >
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 text-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)} // Close menu and handle coming soon
                  // Changed hover text color to black
                  className="py-2 text-center hover:text-black hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                onClick={handleSignUp}
                className="w-full mt-4 bg-black text-white px-4 py-2 rounded-md"
              >
                Sign Up
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
