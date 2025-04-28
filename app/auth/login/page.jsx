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

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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

    setLoading(true);
    const loadingToastId = toast.loading("Attempting login...");

    // Construct the backend login URL
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com"; // Use env var or fallback
    const loginUrl = `${baseApiUrl}/apiv1/auth/login`;
    console.log("Attempting login with backend at:", loginUrl);

    try {
      // 1. Authenticate with your main backend API
      const loginRes = await axios.post(loginUrl, form);

      if (loginRes.data.success) {
        const { token, user } = loginRes.data;

        // 2. Call the Next.js API route to set the HTTP-only cookie
        try {
            // --- Using the user-specified path for the internal Next.js API route ---
            console.log("Attempting to set cookie via Next.js API route: /apiv1/auth/set-token"); // Log the path being used
            await axios.post('/auth/set-token', { token }); // Use /apiv1/ as specified by user

            toast.dismiss(loadingToastId);
            toast.success("Login successful!");

            // 3. Redirect based on user type *after* cookie is set
            if (user.accountType === "Admin") {
              router.push("/admin-dashboard");
            } else {
              router.push("/user-dashboard");
            }

        } catch (cookieError) {
             toast.dismiss(loadingToastId);
             console.error("Failed to set auth cookie via /apiv1/auth/set-token:", cookieError);
             // Check if the error is a 404, which indicates the path might still be wrong
             if (cookieError.response?.status === 404) {
                 toast.error("Login failed: Could not find the internal API route to set the session. Check path '/apiv1/auth/set-token'.");
             } else {
                 const errorMessage = cookieError.response?.data?.message || "Could not set session.";
                 toast.error(`Login failed: ${errorMessage}`);
             }
        }

      } else {
        // Handle backend login failure reported by your main API
        toast.dismiss(loadingToastId);
        toast.error(loginRes.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      // Handle network errors or other issues calling the main backend login API
      console.error("Login error response:", err.response);
      console.error("Login error request:", err.request);
      console.error("Login error message:", err.message);
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials or network connection.");
    } finally {
      if (mounted) {
         setLoading(false);
      }
    }
  };

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
            <a href="/auth/signup" className="font-medium text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
