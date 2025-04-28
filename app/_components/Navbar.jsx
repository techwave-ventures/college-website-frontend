"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios
import toast from 'react-hot-toast'; // For logout messages
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { LogOut, LayoutDashboard } from "lucide-react"; // Icons for dropdown

// Placeholder Logo SVG
const Logo = () => (
  <svg height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#000000" />
    <text x="50" y="60" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">C</text>
  </svg>
);

// Define Navigation Links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ExploreColleges", label: "Explore Colleges" },
  { href: "/blogs", label: "Blogs" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data
  const [isLoadingUser, setIsLoadingUser] = useState(true); // State to track user loading

  // Fetch user status on mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      // Construct the backend user profile URL
      // IMPORTANT: Replace with your actual backend endpoint for fetching logged-in user data
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // Use env var or fallback
      const profileUrl = `${baseApiUrl}/apiv1/users/me`; // Assumes '/apiv1/users/me' is your protected route

      try {
        // Attempt to fetch user data. Axios sends cookies automatically with `withCredentials`
        const response = await axios.get(profileUrl, {
          withCredentials: true, // Crucial for sending the httpOnly cookie
        });

        if (response.data && response.data.success) {
          setUser(response.data.user); // Assuming backend returns { success: true, user: {...} }
        } else {
          setUser(null); // Set user to null if backend indicates failure
        }
      } catch (error) {
        // If request fails (e.g., 401 Unauthorized), user is not logged in
        console.log("User not logged in or failed to fetch status:", error.response?.status);
        setUser(null);
      } finally {
        setIsLoadingUser(false); // Finished loading attempt
      }
    };

    fetchUserStatus();
  }, []); // Empty dependency array ensures this runs only once on mount

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

  const handleLogout = async () => {
    setMenuOpen(false);
    const loadingToastId = toast.loading("Logging out...");
    try {
      // Call the Next.js API route to clear the cookie
      await axios.post('/api/auth/logout'); // Use the correct path for your logout API route
      toast.dismiss(loadingToastId);
      toast.success("Logged out successfully!");
      setUser(null); // Clear user state
      // Use window.location.replace for a full page refresh to clear state and ensure middleware runs
      window.location.replace('/auth/login');
      // router.push('/auth/login'); // router.push might not trigger middleware correctly after logout
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Function to get user initials
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster for logout messages */}
      <div className="container mx-auto flex justify-between items-center p-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
           <Logo />
           <span className="text-xl font-bold text-gray-800 hidden sm:inline">Campus Sathi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="hover:text-black hover:underline underline-offset-4 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Conditional Rendering: Sign Up Button or Profile Dropdown (Desktop) */}
        <div className="hidden md:flex items-center">
          {isLoadingUser ? (
            // Optional: Show a loading state or a disabled button
             <Button
               disabled
               className="bg-gray-400 text-white px-5 py-2 rounded-md cursor-not-allowed"
             >
               Loading...
             </Button>
          ) : user ? (
            // User is logged in - Show Profile Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border">
                    {/* Optional: Add AvatarImage if you have user image URLs */}
                    {/* <AvatarImage src={user.imageUrl} alt={user.name} /> */}
                    <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                      {getInitials(user.name)} {/* Display initials */}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(user.accountType === 'Admin' ? '/admin-dashboard' : '/user-dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // User is not logged in - Show Sign Up Button
            <Button
              onClick={handleSignUp}
              className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md"
            >
              Sign Up
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700 hover:text-black transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col p-6 md:hidden"
          >
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 text-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="py-2 text-center hover:text-black hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
               {/* Conditional Rendering: Sign Up Button or User Info (Mobile) */}
               <div className="mt-4 border-t pt-4">
                 {isLoadingUser ? (
                    <Button disabled className="w-full bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                       Loading...
                    </Button>
                 ) : user ? (
                   // User is logged in - Show user info and Logout
                   <div className="text-center space-y-3">
                     <p className="font-medium">{user.name}</p>
                     <p className="text-sm text-gray-500">{user.email}</p>
                     <Button
                       variant="outline"
                       onClick={() => {
                           setMenuOpen(false);
                           router.push(user.accountType === 'Admin' ? '/admin-dashboard' : '/user-dashboard');
                       }}
                       className="w-full"
                     >
                       Dashboard
                     </Button>
                     <Button
                       variant="destructive"
                       onClick={handleLogout}
                       className="w-full"
                     >
                       Log Out
                     </Button>
                   </div>
                 ) : (
                   // User is not logged in - Show Sign Up
                   <Button
                     onClick={handleSignUp}
                     className="w-full bg-black text-white px-4 py-2 rounded-md"
                   >
                     Sign Up
                   </Button>
                 )}
               </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}