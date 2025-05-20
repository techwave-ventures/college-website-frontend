// pages/auth/login.js (or your chosen path - e.g., app/auth/login/page.jsx)
"use client"; // Keep this at the top

// Import Suspense from React
import React, { useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';

// Import UI components (assuming paths are correct)
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
import { Loader2 } from "lucide-react";

// --- Component using useSearchParams ---
// This component contains the actual form logic and uses the hook
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook is now inside the Suspense boundary
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading("Attempting login...");
    const loginUrl = `${baseApiUrl}/apiv1/auth/login`;

    try {
      const loginRes = await axios.post(
        loginUrl,
        form,
        { withCredentials: true }
      );

      toast.dismiss(loadingToastId);

      if (loginRes.data.success) {
        toast.success("Login successful!");
        const user = loginRes.data.user;
        const redirectedFrom = searchParams.get('redirectedFrom'); // Now works correctly
        const isValidRedirect = redirectedFrom && redirectedFrom.startsWith('/');

        setTimeout(() => {
          let targetPath = '';
          if (isValidRedirect) {
            targetPath = redirectedFrom;
          } else {
            targetPath = user?.accountType === "Admin" ? "/admin-dashboard" : "/";
          }
          router.push(targetPath);
        }, 500);

      } else {
        toast.error(loginRes.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Login Error:", error);
      let errorMessage = "Login failed. Please check your credentials or network connection.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error (${error.response.status}). Please try again.`;
      } else if (error.request) {
        errorMessage = "No response from server. Check your network connection.";
      } else {
        errorMessage = `An error occurred: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Return the actual form UI ---
  return (
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
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}


// --- Main Page Component ---
// This component now wraps the LoginForm in Suspense
const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Wrap the component using useSearchParams in Suspense */}
      <Suspense fallback={<LoadingFallback />}>
          <LoginForm />
      </Suspense>
    </div>
  );
};

// Optional: A simple fallback component
const LoadingFallback = () => {
    return (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
}

export default LoginPage;