// components/RegistrationForm.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // Keep Card imports if using internally, otherwise remove
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Define the backend endpoint URL for initiating payment
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://college-website-backend-main.onrender.com';
const PAYMENT_ENDPOINT_PATH = "/apiv1/register-and-pay";

const casteCategories = [ "General", "OBC", "SC", "ST", "VJ/NT", "SBC", "EWS", "Other" ];

// Accept 'plan' and 'onSuccess' props
export default function RegistrationForm({ plan, onSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    casteCategory: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    questions: "",
    // Add plan details to initial state if needed, though they come from props
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes (same as before)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors((prev) => ({ ...prev, [name]: null })); }
  };

  // Handle select change (same as before)
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, casteCategory: value }));
     if (errors.casteCategory) { setErrors((prev) => ({ ...prev, casteCategory: null })); }
  };

  // Validation function (same as before)
  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required.";
    if (!formData.casteCategory) formErrors.casteCategory = "Caste Category is required.";
    if (!formData.email.trim()) { formErrors.email = "Email is required."; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { formErrors.email = "Email address is invalid."; }
    if (!formData.phoneNumber.trim()) { formErrors.phoneNumber = "Phone number is required."; }
    else if (!/^\d{10}$/.test(formData.phoneNumber)) { formErrors.phoneNumber = "Phone number must be 10 digits."; }
    if (!formData.whatsappNumber.trim()) { formErrors.whatsappNumber = "WhatsApp number is required."; }
    else if (!/^\d{10}$/.test(formData.whatsappNumber)) { formErrors.whatsappNumber = "WhatsApp number must be 10 digits."; }
    if (!formData.questions.trim()) formErrors.questions = "Please enter your questions.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission - UPDATED
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a plan is selected (passed via props)
    if (!plan) {
        toast.error("No plan selected. Please close and select a plan.");
        return;
    }
    // Handle free plan separately if needed (e.g., just register without payment)
    if (plan.amount === 0) {
        toast.success("Handling free plan registration..."); // Placeholder
        // Add logic here to register the user for the free plan
        // Maybe call a different backend endpoint or skip payment
        // Example: registerFreePlan(formData);
        if (onSuccess) onSuccess(); // Close modal after handling
        return; // Stop execution for free plan
    }


    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Processing registration...");
    const fullApiUrl = `${backend_url}${PAYMENT_ENDPOINT_PATH}`;

    // --- Prepare data to send to backend ---
    const dataToSend = {
        ...formData,
        planName: plan.name, // Include selected plan name
        amount: plan.amount,   // Include selected plan amount (in paisa)
    };
    // --------------------------------------

    try {
      console.log("Submitting registration data:", dataToSend); // Log data being sent
      console.log("Sending POST request to:", fullApiUrl);

      // Send the combined form data and plan details
      const response = await axios.post(fullApiUrl, dataToSend, {
          withCredentials: true, // Send cookies if user needs to be logged in
      });

      console.log("Backend Response:", response.data);

      if (response.data && response.data.success && response.data.redirectUrl) {
        toast.success("Redirecting to payment gateway...", { id: loadingToastId });
        if (onSuccess) onSuccess(); // Close modal before redirecting
        // Short delay to allow modal to close visually before redirect
        setTimeout(() => {
             window.location.href = response.data.redirectUrl;
        }, 300);
      } else {
        throw new Error(response.data.message || "Failed to initiate payment from backend.");
      }

    } catch (error) {
      setIsSubmitting(false);
      toast.dismiss(loadingToastId);
      console.error("Registration or Payment Initiation Failed:", error);
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error.response) {
          errorMsg = error.response.data?.message || `Server error: ${error.response.status}`;
          if (error.response.status === 401 || error.response.status === 403) {
              errorMsg = "Authentication failed. Please ensure you are logged in.";
          }
      } else if (error.request) {
          errorMsg = "Network error. Please check connection.";
      } else {
          errorMsg = error.message;
      }
      toast.error(`Error: ${errorMsg}`);
    }
  };

  // --- Render ---
  // Removed the outer Card, as it's rendered inside a Dialog
  return (
    // Form element now directly inside DialogContent
    <form onSubmit={handleSubmit} className="pt-4"> {/* Add some padding */}
        {/* Toaster should be in a higher-level layout */}
        {/* <Toaster position="top-right" reverseOrder={false} /> */}

        <div className="space-y-5"> {/* Adjusted spacing */}
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="reg-name" className="font-medium text-gray-700 text-sm">Full Name <span className="text-red-500">*</span></Label>
              <Input id="reg-name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required className={errors.name ? 'border-red-500' : ''} disabled={isSubmitting} />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Caste Category */}
            <div className="space-y-1">
              <Label htmlFor="reg-casteCategory" className="font-medium text-gray-700 text-sm">Caste Category <span className="text-red-500">*</span></Label>
              <Select value={formData.casteCategory} onValueChange={handleCategoryChange} name="casteCategory" required disabled={isSubmitting}>
                <SelectTrigger id="reg-casteCategory" className={errors.casteCategory ? 'border-red-500' : ''}><SelectValue placeholder="Select your category" /></SelectTrigger>
                <SelectContent><SelectGroup><SelectLabel>Categories</SelectLabel>{casteCategories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}</SelectGroup></SelectContent>
              </Select>
               {errors.casteCategory && <p className="text-xs text-red-600">{errors.casteCategory}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="reg-email" className="font-medium text-gray-700 text-sm">Email Address <span className="text-red-500">*</span></Label>
              <Input id="reg-email" name="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} required className={errors.email ? 'border-red-500' : ''} disabled={isSubmitting} />
               {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="reg-phoneNumber" className="font-medium text-gray-700 text-sm">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="reg-phoneNumber" name="phoneNumber" type="tel" placeholder="Enter 10-digit phone number" value={formData.phoneNumber} onChange={handleChange} required maxLength={10} className={errors.phoneNumber ? 'border-red-500' : ''} disabled={isSubmitting} />
               {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
            </div>

             {/* WhatsApp Number */}
            <div className="space-y-1">
              <Label htmlFor="reg-whatsappNumber" className="font-medium text-gray-700 text-sm">WhatsApp Number <span className="text-red-500">*</span></Label>
              <Input id="reg-whatsappNumber" name="whatsappNumber" type="tel" placeholder="Enter 10-digit WhatsApp number" value={formData.whatsappNumber} onChange={handleChange} required maxLength={10} className={errors.whatsappNumber ? 'border-red-500' : ''} disabled={isSubmitting} />
               {errors.whatsappNumber && <p className="text-xs text-red-600">{errors.whatsappNumber}</p>}
            </div>

            {/* Questions */}
            <div className="space-y-1">
              <Label htmlFor="reg-questions" className="font-medium text-gray-700 text-sm">Your Questions for Guidance <span className="text-red-500">*</span></Label>
              <Textarea id="reg-questions" name="questions" placeholder="Please list any specific questions..." value={formData.questions} onChange={handleChange} required rows={4} className={errors.questions ? 'border-red-500' : ''} disabled={isSubmitting} />
               {errors.questions && <p className="text-xs text-red-600">{errors.questions}</p>}
            </div>
        </div>

        {/* Footer within the form for the submit button */}
        <div className="flex justify-end pt-6 mt-6 border-t"> {/* Added top margin/border */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md w-full sm:w-auto"
            >
              {isSubmitting ? (
                <> <Loader2 className="animate-spin mr-2 h-4 w-4" /> Processing... </>
              ) : (
                // Dynamically show amount if > 0
                `Register & Proceed to Pay ${plan?.amount > 0 ? `(₹${plan.amount / 100})` : ''}`
              )}
            </Button>
        </div>
    </form>
  );
}
