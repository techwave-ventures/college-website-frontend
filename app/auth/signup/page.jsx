"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://college-website-backend-main.onrender.com/apiv1/auth/signup",
        form
      );

      if (res.data.success) {
        router.push("/auth/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Name" onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-sm text-center mt-3">
          Already have an account? <a href="/auth/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
