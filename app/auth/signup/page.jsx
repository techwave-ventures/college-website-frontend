// pages/auth/signup.js (or your chosen path)
"use client"; // Required for client-side interactivity (hooks, event handlers)

import { useState, useEffect } from "react"; // Removed unused useEffect
import axios from "axios"; // For making API calls
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router
import Link from "next/link"; // For client-side navigation (Login link)
import toast, { Toaster } from 'react-hot-toast'; // For user feedback

// Import UI components from shadcn/ui (ensure paths are correct)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Loading spinner icon

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    accountType: "Student", // Default account type
  });
  const [loading, setLoading] = useState(false);

  // Define Backend API URL using environment variable
  // Ensure NEXT_PUBLIC_API_URL is set in your .env.local file
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com"; // Fallback for local dev

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic client-side password match validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Creating account...");

    // Prepare data for the backend
    const signupData = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        confirmPassword: form.confirmPassword, // Send confirmPassword for backend check
        accountType: form.accountType,
    };

    // Construct the full API endpoint URL
    const signupUrl = `${baseApiUrl}/apiv1/auth/signup`;
    console.log("Attempting signup at URL:", signupUrl);
    console.log("Sending signup data:", signupData); // Log data being sent

    try {
      // Send POST request to the backend signup endpoint
      const response = await axios.post(signupUrl, signupData);

      toast.dismiss(loadingToastId);

      // Check if backend indicates success
      if (response.data.success) {
        toast.success("Account created successfully! Redirecting to login...");
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/login"); // Navigate to login page
        }, 1500); // 1.5 second delay
      } else {
        // Show error message from backend if available
        toast.error(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Signup Error:", error); // Log the full error object

      // Extract and display a user-friendly error message
      let errorMessage = "Signup failed. Please check your details or network connection.";
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        errorMessage = error.response.data?.message || `Server error (${error.response.status}). Please try again.`;
      } else if (error.request) {
        console.error("Error Request:", error.request);
        errorMessage = "No response from server. Check your network connection.";
      } else {
        console.error("Error Message:", error.message);
        errorMessage = `An error occurred: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setLoading(false);
    }
  };

  // --- UI Reverted to Previous Style ---
  return (
    // Original gradient background
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      {/* Toaster for displaying notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Signup Card (Original Styling) */}
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form with original input/button styling */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="rounded-md" // Original class
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="rounded-md" // Original class
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel" // Keep 'tel' type
                name="phoneNumber"
                placeholder="e.g., 9876543210"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                disabled={loading}
                className="rounded-md" // Original class
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6} // Keep minLength
                disabled={loading}
                className="rounded-md" // Original class
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="rounded-md" // Original class
              />
            </div>

            {/* Submit Button (Original Styling) */}
            <Button type="submit" className="w-full rounded-md" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            {/* Use Next.js Link for internal navigation */}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;