// pages/auth/login.js (or your chosen path)
"use client"; // Required for client-side interactivity

import { useState } from "react"; // Removed unused useEffect
import axios from "axios"; // For making API calls
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router
import Link from "next/link"; // For client-side navigation (Sign Up link)
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

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
    setLoading(true);
    const loadingToastId = toast.loading("Attempting login...");

    // Construct the backend login URL
    const loginUrl = `${baseApiUrl}/apiv1/auth/login`;
    console.log("Attempting login with backend at:", loginUrl);

    try {
      // --- CRITICAL CHANGE: Call backend login directly and include credentials ---
      // The backend will set the httpOnly cookie via the Set-Cookie header
      const loginRes = await axios.post(
        loginUrl,
        form, // Send email and password
        {
          withCredentials: true, // IMPORTANT: Sends existing cookies and allows receiving Set-Cookie header
        }
      );

      toast.dismiss(loadingToastId);

      // Check if the backend indicates successful login
      if (loginRes.data.success) {
        toast.success("Login successful!");
        const user = loginRes.data.user; // Get user info from response

        // --- REMOVED: Logic to call internal /set-token route ---
        // The cookie is now set directly by the backend response.

        // Redirect based on user type
        // Add a small delay for the toast message to be visible
        setTimeout(() => {
            if (user?.accountType === "Admin") {
                router.push("/admin-dashboard"); // Redirect admin
            } else {
                router.push("/user-dashboard"); // Redirect regular user (e.g., Student)
            }
            // Optionally use router.replace() to prevent going back to login page
            // router.replace(user?.accountType === "Admin" ? "/admin-dashboard" : "/user-dashboard");
        }, 500); // 0.5 second delay

      } else {
        // Handle backend login failure reported by the API
        toast.error(loginRes.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Login Error:", error); // Log the full error object

      // Extract and display a user-friendly error message
      let errorMessage = "Login failed. Please check your credentials or network connection.";
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
      // Ensure loading state is reset
      setLoading(false);
    }
  };

  // --- UI Remains the Same ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="rounded-md"
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
                disabled={loading}
                className="rounded-md"
              />
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full rounded-md" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            {/* Use Next.js Link for internal navigation */}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;