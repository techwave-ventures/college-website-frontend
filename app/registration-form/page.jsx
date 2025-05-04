// components/RegistrationForm.jsx (or your preferred path)
// This is a Client Component for the registration form.

"use client"; // Required for hooks and event handlers

import { useState } from "react";
import axios from "axios"; // For making API calls
import toast, { Toaster } from 'react-hot-toast'; // For notifications
import { useRouter } from "next/navigation"; // For potential redirects

// Import UI components (ensure paths are correct for your project)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Loading icon

// Define the backend base URL and the specific endpoint path
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://college-website-backend-main.onrender.com'; // Use env variable or default
const PAYMENT_ENDPOINT_PATH = "/apiv1/register-and-pay"; // The specific path on your backend

// Define Caste Categories (adjust as needed)
const casteCategories = [
  "General",
  "OBC",
  "SC",
  "ST",
  "VJ/NT",
  "SBC",
  "EWS",
  "Other",
];

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    casteCategory: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    questions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle select change for Caste Category
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      casteCategory: value,
    }));
     if (errors.casteCategory) {
      setErrors((prev) => ({ ...prev, casteCategory: null }));
    }
  };

  // Basic client-side validation
  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required.";
    if (!formData.casteCategory) formErrors.casteCategory = "Caste Category is required.";
    if (!formData.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email address is invalid.";
    }
    if (!formData.phoneNumber.trim()) {
        formErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) { // Simple 10-digit validation
        formErrors.phoneNumber = "Phone number must be 10 digits.";
    }
     if (!formData.whatsappNumber.trim()) {
        formErrors.whatsappNumber = "WhatsApp number is required.";
    } else if (!/^\d{10}$/.test(formData.whatsappNumber)) { // Simple 10-digit validation
        formErrors.whatsappNumber = "WhatsApp number must be 10 digits.";
    }
    if (!formData.questions.trim()) formErrors.questions = "Please enter your questions.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Processing registration...");

    // Construct the full backend API URL
    const fullApiUrl = `${backend_url}${PAYMENT_ENDPOINT_PATH}`; // e.g., http://localhost:5000/apiv1/register-and-pay

    try {
      console.log("Submitting registration data:", formData);
      console.log("Sending POST request to:", fullApiUrl); // Log the target URL

      // Call your backend API endpoint with the form data and credentials
      const response = await axios.post(fullApiUrl, formData, {
          // Include credentials (cookies) as the backend route is protected by auth middleware
          withCredentials: true,
      });

      console.log("Backend Response:", response.data);

      // Assuming the backend responds with { success: true, redirectUrl: '...' }
      if (response.data && response.data.success && response.data.redirectUrl) {
        toast.success("Redirecting to payment gateway...", { id: loadingToastId });
        // Redirect the user to the PhonePe payment page
        window.location.href = response.data.redirectUrl;
      } else {
        // Handle cases where the backend couldn't initiate payment (e.g., validation error on backend)
        throw new Error(response.data.message || "Failed to initiate payment from backend.");
      }

    } catch (error) {
      setIsSubmitting(false);
      toast.dismiss(loadingToastId);
      console.error("Registration or Payment Initiation Failed:", error);

      // Provide more specific error feedback
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error.response) {
          // Error from backend response
          errorMsg = error.response.data?.message || `Server error: ${error.response.status}`;
          if (error.response.status === 401 || error.response.status === 403) {
              errorMsg = "Authentication failed. Please ensure you are logged in.";
              // Optionally redirect to login
              // router.push('/auth/login');
          }
      } else if (error.request) {
          // Network error (no response received)
          errorMsg = "Network error. Please check your connection and ensure the backend is running.";
      } else {
          // Other errors (e.g., setting up the request)
          errorMsg = error.message;
      }
      toast.error(`Error: ${errorMsg}`);
    }
    // Note: setIsSubmitting(false) might not be reached if redirection happens successfully
  };

  // --- Render ---
  // The JSX part remains the same as your provided code
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Ensure Toaster is rendered, preferably in a root layout */}
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-gray-200 rounded-lg">
        <CardHeader className="bg-gray-50 p-6 rounded-t-lg border-b">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Guidance Registration & Payment
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-1">
            Fill in your details to register for guidance. Payment is required.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className={errors.name ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Caste Category */}
            <div className="space-y-2">
              <Label htmlFor="casteCategory" className="font-medium text-gray-700">Caste Category <span className="text-red-500">*</span></Label>
              <Select
                value={formData.casteCategory}
                onValueChange={handleCategoryChange}
                name="casteCategory"
                required
                disabled={isSubmitting}
              >
                <SelectTrigger id="casteCategory" className={errors.casteCategory ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {casteCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
               {errors.casteCategory && <p className="text-xs text-red-600">{errors.casteCategory}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
               {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                maxLength={10}
                className={errors.phoneNumber ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
               {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
            </div>

             {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="font-medium text-gray-700">WhatsApp Number <span className="text-red-500">*</span></Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                placeholder="Enter 10-digit WhatsApp number"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                 maxLength={10}
                className={errors.whatsappNumber ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
               {errors.whatsappNumber && <p className="text-xs text-red-600">{errors.whatsappNumber}</p>}
            </div>

            {/* Questions */}
            <div className="space-y-2">
              <Label htmlFor="questions" className="font-medium text-gray-700">Your Questions for Guidance <span className="text-red-500">*</span></Label>
              <Textarea
                id="questions"
                name="questions"
                placeholder="Please list any specific questions or areas where you need guidance..."
                value={formData.questions}
                onChange={handleChange}
                required
                rows={5}
                className={errors.questions ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
               {errors.questions && <p className="text-xs text-red-600">{errors.questions}</p>}
            </div>

          </CardContent>
          <CardFooter className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                "Register & Proceed to Pay"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}