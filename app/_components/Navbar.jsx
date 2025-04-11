"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Logo</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-gray-700">
          <a href="/" className="hover:text-black">Home Page</a>
          <a href="#" className="hover:text-black">About Us</a>
          <a href="#" className="hover:text-black">Consultancy Services</a>
          <a href="/ExploreColleges" className="hover:text-black">Explore Colleges</a>
        </div>

        {/* Sign Up Button */}
        <Button onClick={() => router.push("/auth/signup")} className="hidden md:block bg-black text-white px-4 py-2">
          Sign Up
        </Button>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-2xl">
          <IoMdMenu />
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ duration: 0.3 }} 
            className="fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg flex flex-col p-6 md:hidden"
          >
            {/* Close Button */}
            <button onClick={() => setMenuOpen(false)} className="self-end text-3xl">
              <IoMdClose />
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 mt-4 text-gray-700">
              <a href="/" className="hover:text-black" onClick={() => setMenuOpen(false)}>Home Page</a>
              <a href="#" className="hover:text-black" onClick={() => setMenuOpen(false)}>About Us</a>
              <a href="#" className="hover:text-black" onClick={() => setMenuOpen(false)}>Consultancy Services</a>
              <a href="/ExploreColleges" className="hover:text-black" onClick={() => setMenuOpen(false)}>Explore Colleges</a>
              <Button onClick={() => { setMenuOpen(false); router.push("/auth/signup"); }} className="bg-black text-white px-4 py-2">
                Sign Up
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
