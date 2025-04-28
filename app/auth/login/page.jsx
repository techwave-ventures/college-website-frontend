"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
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

// Make sure you have installed react-hot-toast: npm install react-hot-toast

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
    const loadingToastId = toast.loading("Attempting login..."); // Use react-hot-toast loading

    try {
      const res = await axios.post(
        "https://college-website-backend-main.onrender.com/apiv1/auth/login",
        form
      );

      toast.dismiss(loadingToastId); // Dismiss toast

      if (res.data.success) {
        toast.success("Login successful!"); // Use react-hot-toast success
        localStorage.setItem("token", res.data.token);

        if (res.data.user.accountType === "Admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/user-dashboard");
        }
      } else {
        toast.error(res.data.message || "Login failed. Please try again."); // Use react-hot-toast error
      }
    } catch (err) {
      toast.dismiss(loadingToastId); // Dismiss toast on error
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials."); // Use react-hot-toast error
      console.error("Login error:", err);
    } finally {
      if (mounted) {
         setLoading(false);
      }
    }
  };

  return (
    // Added Toaster component here for react-hot-toast
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
       {/* Toaster component is required for react-hot-toast to display notifications */}
       {/* You can customize its position and other options here if needed */}
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
