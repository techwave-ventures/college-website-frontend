// components/Navbar.js (or your preferred path)
"use client"; // Essential for components using hooks and event handlers

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router
import axios from "axios"; // For making API calls
import toast, { Toaster } from 'react-hot-toast'; // For user feedback
import { IoMdMenu, IoMdClose } from "react-icons/io"; // Menu icons
import { motion, AnimatePresence } from "framer-motion"; // Animations

// Import UI components from shadcn/ui (ensure these paths are correct)
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react"; // Icons for dropdown

// Placeholder Logo SVG (Keep or replace with your actual logo component/image)
const Logo = () => (
  <svg height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#000000" />
    <text x="50" y="60" fontSize="40" fill="white" textAnchor="middle" fontWeight="bold">C</text>
  </svg>
);

// Define Navigation Links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" }, // Marked as coming soon in handler
  { href: "/ExploreColleges", label: "Explore Colleges" },
  { href: "/blogs/MHTCET", label: "Blogs" }, // Marked as coming soon in handler
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // State to hold authenticated user data
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Track loading state for user check

  // Define Backend API URL using environment variable
  // Ensure NEXT_PUBLIC_API_URL is set in your .env.local file
  // *** Updated fallback port to 5000 based on user's index.js ***
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com";

  // Fetch user status on component mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      setIsLoadingUser(true);
      // *** CHANGE: Use the correct user profile endpoint ***
      const profileUrl = `${baseApiUrl}/apiv1/users/getUserProfile`; // Updated endpoint

      console.log("Navbar: Attempting to fetch user status from:", profileUrl); // Log endpoint

      try {
        // Send request with credentials to include the httpOnly cookie
        const response = await axios.get(profileUrl, {
          withCredentials: true, // Crucial for sending the cookie
        });

        console.log("Navbar: Received response from profile URL:", response.data); // Log response

        // *** CHANGE: Check response based on getUserProfile controller ***
        // Assuming backend sends { success: true, user: {...} } on success
        if (response.data && response.data.success && response.data.user) {
          setUser(response.data.user);
          console.log("Navbar: User authenticated:", response.data.user);
        } else {
          setUser(null); // Not authenticated or unexpected response
          console.log("Navbar: User not authenticated or response format incorrect.");
        }
      } catch (error) {
        console.error("Navbar: Failed to fetch user status.", error); // Log the full error
        // Common case: 401/403 means not logged in or session expired
        if (error.response) {
             console.error("Navbar: Error response status:", error.response.status);
             console.error("Navbar: Error response data:", error.response.data);
             if (error.response.status === 401 || error.response.status === 403) {
                 console.log("Navbar: User session invalid or expired.");
             }
        } else if (error.request) {
             console.error("Navbar: No response received for user status check.");
        } else {
             console.error("Navbar: Error setting up user status request:", error.message);
        }
        setUser(null); // Assume not logged in on any error
      } finally {
        setIsLoadingUser(false); // Finished loading attempt
      }
    };

    fetchUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: runs only once on mount

  // Handle navigation link clicks
  const handleLinkClick = (e, href) => {
    // Handle "coming soon" links
    if (href === '/about' || href.startsWith('/blogs')) { // Adjusted check for blogs
      e.preventDefault(); // Prevent default link behavior
      router.push('/coming-soon'); // Redirect to coming soon page
    }
    // Close mobile menu if open
    setMenuOpen(false);
  };

  // Navigate to Sign Up page
  const handleSignUp = () => {
    setMenuOpen(false);
    router.push("/auth/signup"); // Ensure this route exists in your Next.js app
  };

  // Handle User Logout
  const handleLogout = async () => {
    setMenuOpen(false);
    const loadingToastId = toast.loading("Logging out...");

    // Call the BACKEND logout endpoint directly
    const logoutUrl = `${baseApiUrl}/apiv1/auth/logout`; // Backend endpoint to clear the cookie

    try {
      // Send POST request to backend logout endpoint with credentials
      await axios.post(logoutUrl, {}, { // Empty body often sufficient for logout
        withCredentials: true, // Crucial to allow backend to clear the cookie
      });

      toast.dismiss(loadingToastId);
      toast.success("Logged out successfully!");
      setUser(null); // Clear user state immediately in the frontend

      // Force a full page reload to ensure all state is cleared and middleware re-runs
      // Redirect to login page after successful logout
      window.location.replace('/auth/login'); // Use replace to clear history stack

    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Logout failed:", error.response?.data || error.message);
      // Provide specific feedback if possible, otherwise generic
      const errorMessage = error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Function to generate initials from user name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "?";
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || "?"; // Handle empty string after trim
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // --- UI Rendering (Remains the same as previous Navbar version) ---
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {/* Toaster component for displaying notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container mx-auto flex justify-between items-center p-4 md:px-6">

        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">Campus Sathi</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium hover:text-black hover:underline underline-offset-4 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Area: Loading / User Dropdown / Sign Up Button */}
        <div className="hidden md:flex items-center">
          {isLoadingUser ? (
            <Button disabled variant="outline" size="sm" className="cursor-wait opacity-70">
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border">
                    {/* <AvatarImage src={user.imageUrl || undefined} alt={user.name || 'User'} /> */}
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || 'No email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                   className="cursor-pointer"
                   onClick={() => router.push(user.accountType === 'Admin' ? '/admin-dashboard' : '/')} // Redirect non-admin to home '/'
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleSignUp}
              size="sm"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"
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

      {/* Mobile Navigation Menu (Animated) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col md:hidden overflow-hidden"
          >
            <div className="p-5">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3 text-gray-700 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="py-2 px-3 text-center text-base font-medium hover:text-black hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Area */}
              <div className="border-t pt-4">
                {isLoadingUser ? (
                   <Button disabled className="w-full bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                     Loading...
                   </Button>
                ) : user ? (
                  <div className="text-center space-y-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(user.accountType === 'Admin' ? '/admin-dashboard' : '/user-dashboard'); // Keep user-dashboard here if it exists
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
                  <Button
                    onClick={handleSignUp}
                    className="w-full bg-black text-white px-4 py-2 rounded-md"
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}