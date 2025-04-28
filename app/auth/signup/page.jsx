"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
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

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mounted) return;

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Creating account...");

    const signupData = form; // Send the complete form data

    // --- FIX: Correctly construct the API URL ---
    const baseApiUrl = "https://college-website-backend-main.onrender.com" || "http://localhost:5000"; // Get base URL or fallback
    const signupUrl = `${baseApiUrl}/apiv1/auth/signup`; // Append the specific endpoint

    console.log("Attempting signup at URL:", signupUrl); // Add log to verify URL

    try {
      const res = await axios.post(
        signupUrl, // Use the correctly constructed URL
        signupData
      );

      toast.dismiss(loadingToastId);

      if (res.data.success) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
             router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      // Log the error response if available
      console.error("Signup error response:", err.response);
      console.error("Signup error request:", err.request);
      console.error("Signup error message:", err.message);

      toast.error(err.response?.data?.message || "Signup failed. Please check your details or network connection.");
    } finally {
      if (mounted) {
         setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
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
                className="rounded-md"
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
                className="rounded-md"
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="e.g., 9876543210"
                value={form.phoneNumber}
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
                minLength={6}
                disabled={loading}
                className="rounded-md"
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
                className="rounded-md"
              />
            </div>

            {/* Submit Button */}
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
            <a href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;