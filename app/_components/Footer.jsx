// File: app/_components/Footer.jsx (or your path)

import React from 'react';
import Link from 'next/link'; // Import Link for internal navigation

// --- SVG Icons ---

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
  </svg>
);

// Corrected WhatsApp Icon SVG Path
const WhatsAppIcon = () => (
  // Using a viewBox that matches the source SVG (-2 -2 24 24)
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24" className="fill-current">
      <path d="M9.516.012C4.206.262.017 4.652.033 9.929a9.798 9.798 0 0 0 1.085 4.465L.06 19.495a.387.387 0 0 0 .47.453l5.034-1.184a9.981 9.981 0 0 0 4.284 1.032c5.427.083 9.951-4.195 10.12-9.58C20.15 4.441 15.351-.265 9.516.011zm6.007 15.367a7.784 7.784 0 0 1-5.52 2.27 7.77 7.77 0 0 1-3.474-.808l-.701-.347-3.087.726.65-3.131-.346-.672A7.62 7.62 0 0 1 2.197 9.9c0-2.07.812-4.017 2.286-5.48a7.85 7.85 0 0 1 5.52-2.271c2.086 0 4.046.806 5.52 2.27a7.672 7.672 0 0 1 2.287 5.48c0 2.052-.825 4.03-2.287 5.481z"></path>
      <path d="M14.842 12.045l-1.931-.55a.723.723 0 0 0-.713.186l-.472.478a.707.707 0 0 1-.765.16c-.913-.367-2.835-2.063-3.326-2.912a.694.694 0 0 1 .056-.774l.412-.53a.71.71 0 0 0 .089-.726L7.38 5.553a.723.723 0 0 0-1.125-.256c-.539.453-1.179 1.14-1.256 1.903-.137 1.343.443 3.036 2.637 5.07 2.535 2.349 4.566 2.66 5.887 2.341.75-.18 1.35-.903 1.727-1.494a.713.713 0 0 0-.408-1.072z"></path>
  </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);


export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Important Pages Section */}
        <nav className="space-y-2">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Imp Pages</h6>
          <Link href="/" className="block hover:text-white hover:underline transition duration-300">Home</Link>
          <Link href="/pref-list-generator" className="block hover:text-white hover:underline transition duration-300">Preference List Generator</Link>
          <Link href="/ExploreColleges" className="block hover:text-white hover:underline transition duration-300">Explore Colleges</Link>
        </nav>

        {/* Company Section */}
        <nav className="space-y-2">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Company</h6>
          <Link href="/" className="block hover:text-white hover:underline transition duration-300">Home</Link>
          <Link href="/about" className="block hover:text-white hover:underline transition duration-300">About</Link>
          <Link href="/contact" className="block hover:text-white hover:underline transition duration-300">Contact Us</Link>
          <Link href="/privacy-policy" className="block hover:text-white hover:underline transition duration-300">Privacy Policy</Link>
          <Link href="/return-refund-policy" className="block hover:text-white hover:underline transition duration-300">Return & Refund Policy</Link>
          <Link href="/terms-of-service" className="block hover:text-white hover:underline transition duration-300">Terms of Service</Link>
        </nav>

        {/* Follow Us Section */}
        <nav className="space-y-2 md:text-left text-center">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Follow Us</h6>
          <div className="flex space-x-4 justify-center md:justify-start">
             {/* WhatsApp */}
            <a href="https://wa.me/919209143384" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <WhatsAppIcon />
            </a>
             {/* YouTube - Replace '#' with your actual URL */}
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <YouTubeIcon />
            </a>
             {/* Instagram - Replace '#' with your actual URL */}
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <InstagramIcon />
            </a>
          </div>
           {/* Contact Info */}
           <div className="mt-4 text-sm">
             <p>Email: techwaveventures@gmail.com</p>
             <p>Phone: +91 92091 43384</p>
           </div>
        </nav>

      </div>

      {/* Bottom Bar */}
      <div className="text-center mt-10 pt-6 border-t border-gray-700 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Campus Sathi <br />
        Designed & Developed by Techwave ventures Private Limited.
      </div>
    </footer>
  );
}