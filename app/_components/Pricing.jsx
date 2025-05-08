// components/Pricing.jsx (or your path)
"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios'; // Import axios for API calls
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define plan data (ensure IDs match backend PLANS config keys: 'starter', 'pro', 'accelerator')
const pricingPlans = [
    {
        id: "starter", // Matches backend PLANS key
        name: "Starter Pack",
        originalPrice: "₹ 299",
        price: "₹0",
        amount: 0, // Amount in paisa
        priceSuffix: "/ One Time",
        description: "Begin your journey with essential tools.",
        features: [
            "College Preference List Generator (3 Uses)", // Limit defined in backend
            "Access to our MHTCET whatsapp community",
            "Essential Counselling Process Guide",
            "Category-Specific Document Checklist",
            "Previous Year MHT-CET Cutoffs",
            "Latest MHT-CET Updates",
        ],
        buttonText: "Select Free Plan",
        bgColor: "bg-white",
        textColor: "text-gray-900",
        buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white",
        buttonVariant: "default",
        badge: null,
        checkColor: "text-green-600",
    },
    {
        id: "pro", // Matches backend PLANS key
        name: "Guidance Pro",
        originalPrice: "₹ 1599",
        price: "₹999",
        amount: 99900, // Amount in paisa
        priceSuffix: "/ One-Time",
        description: "Personalized guidance to boost your chances.",
        features: [
            "All Starter Pack Features",
            "Advanced College Preference List Generator (5 Uses)", // Limit defined in backend
            "Personalized College Preference List [Expert-Curated]",
            "Expert-Curated Document Checklist",
            "Step by Step Guidance at every stage (Document verification, Registration, Form Filling, Freeze/Float/Betterment)",
            "Dedicated Group Support (WhatsApp)",
            "Guided Form Filling Assistance",
            "Exclusive Guidance Pro Community Access",
        ],
        buttonText: "Get Guidance Pro",
        bgColor: "bg-gray-800",
        textColor: "text-white",
        buttonBgColor: "bg-white hover:bg-gray-200",
        buttonTextColor: "text-gray-800",
        buttonVariant: "secondary",
        badge: "Most Popular",
        badgeStyle: "bg-white text-black",
        checkColor: "text-green-400",
    },
    {
        id: "accelerator", // Matches backend PLANS key
        name: "Admission Accelerator",
        originalPrice: "₹ 3199",
        price: "₹1599",
        amount: 159900, // Amount in paisa
        priceSuffix: "/ One-Time",
        description: "Comprehensive support for guaranteed results.",
        features: [
            "All Guidance Pro Features",
            "Priority WhatsApp Support (Fast Response)",
            "Exclusive Admission Accelerator Community Access",
            "In-Depth 1-on-1 Expert Counselling",
            "Expert-Curated Personalised College Preference List",
            "Dedicated 1-on-1 Form Filling Support",
            "Spot Round / Donation Admission Guidance",
            "Unlimited College List Generator Access", // Limit defined in backend
        ],
        buttonText: "Accelerate Admission",
        bgColor: "bg-white",
        textColor: "text-gray-900",
        buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white",
        buttonVariant: "default",
        badge: null,
        checkColor: "text-green-600",
    },
];


export default function Pricing() {
    const router = useRouter();
    // --- State for Auth Check (similar to original Navbar) ---
    const [user, setUser] = useState(null); // State to hold authenticated user data
    const [isLoadingUser, setIsLoadingUser] = useState(true); // Track loading state for user check
    // --- End Auth State ---

    const [isProcessingPayment, setIsProcessingPayment] = useState(null); // State for payment initiation loading

    // Define Backend API URL
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com";

    // --- Fetch user status on component mount (similar to original Navbar) ---
    useEffect(() => {
        const fetchUserStatus = async () => {
            setIsLoadingUser(true);
            const profileUrl = `${baseApiUrl}/apiv1/users/getUserProfile`; // Use the correct endpoint
            console.log("Pricing: Attempting to fetch user status from:", profileUrl);

            try {
                const response = await axios.get(profileUrl, {
                    withCredentials: true, // Crucial for sending the httpOnly cookie
                });
                console.log("Pricing: Received response from profile URL:", response.data);

                // Assuming backend sends { success: true, user: {...} } on success
                if (response.data && response.data.success && response.data.user) {
                    setUser(response.data.user);
                    console.log("Pricing: User authenticated:", response.data.user);
                } else {
                    setUser(null);
                    console.log("Pricing: User not authenticated or response format incorrect.");
                }
            } catch (error) {
                console.error("Pricing: Failed to fetch user status.", error.response?.data || error.message);
                setUser(null); // Assume not logged in on any error
            } finally {
                setIsLoadingUser(false); // Finished loading attempt
            }
        };

        fetchUserStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array: runs only once on mount
    // --- End Fetch User Status ---


    // Updated function to handle plan selection
    const handleSelectPlan = async (plan) => {
        // Show loading indicator while checking auth state initially
        if (isLoadingUser) {
            toast.loading("Checking authentication..."); // Use toast or disable button
            return;
        }

        // Determine auth status based on local state
        const isAuthenticated = !!user;

        // 1. Check Authentication
        if (!isAuthenticated) {
            toast.error("Please log in or sign up to select a plan.");
            router.push('/auth/login'); // Redirect to your login page route
            return;
        }

        // 2. Handle Free Plan Selection (if logged in)
        if (plan.amount === 0) {
            toast.success(`You have selected the ${plan.name}.`);
            // Optional: Call backend to update plan if necessary
            // await fetch('/apiv1/users/me/set-plan', { method: 'POST', ..., body: JSON.stringify({ planId: plan.id }) });
            return;
        }

        // 3. Handle Paid Plan Selection (if logged in)
        setIsProcessingPayment(plan.id); // Set loading state for this specific button
        const loadingToastId = toast.loading(`Initiating payment for ${plan.name}...`);
        const paymentApiUrl = `${baseApiUrl}/apiv1/payments/initiate-plan`; // Use baseApiUrl

        try {
            // Use fetch API for payment initiation
            const response = await fetch(paymentApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // No Authorization header needed with HttpOnly cookies
                },
                body: JSON.stringify({ planId: plan.id }), // Send only planId
                credentials: 'include' // IMPORTANT: Send cookies
            });

            const result = await response.json();

            if (!response.ok || !result.success || !result.redirectUrl) {
                throw new Error(result.message || `Failed to initiate payment (Status: ${response.status})`);
            }

            // Success: Redirect to payment gateway
            toast.success("Redirecting to payment gateway...", { id: loadingToastId });
            window.location.href = result.redirectUrl; // Redirect

        } catch (error) {
            console.error("Payment Initiation Failed:", error);
            toast.error(`Error: ${error.message || 'Could not initiate payment.'}`, { id: loadingToastId });
        } finally {
            setIsProcessingPayment(null); // Clear loading state
        }
    };

    return (
        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 md:py-24 px-6 sm:px-12 lg:px-20">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    Unlock Your Admission Success
                </h2>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                    Choose the perfect plan to navigate your college admission journey with confidence and expert support.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`flex flex-col rounded-xl shadow-lg overflow-hidden ${plan.bgColor} ${plan.textColor} ${plan.badge ? 'border-2 border-gray-600 relative' : 'border'}`}
                        >
                            {/* Card Header */}
                            <CardHeader className="px-4 pt-4 pb-2">
                                <CardTitle className={`text-2xl font-semibold ${plan.badge ? 'text-white' : 'text-gray-800'}`}>{plan.name}</CardTitle>
                                <CardDescription className={`mt-2 text-sm ${plan.badge ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            {/* Card Content */}
                            <CardContent className="flex-grow px-4 pt-2 pb-4 space-y-3">
                                <div className="mb-4">
                                    {plan.originalPrice && (
                                        <p className={`text-xs line-through ${plan.badge ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {plan.originalPrice}
                                        </p>
                                    )}
                                    <p className={`text-3xl font-bold ${plan.badge ? 'text-white' : 'text-gray-900'}`}>
                                        {plan.price}
                                        <span className={`text-base font-normal ml-1 ${plan.badge ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {plan.priceSuffix}
                                        </span>
                                    </p>
                                </div>
                                <ul className={`text-left space-y-2 ${plan.badge ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.checkColor}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            {/* Card Footer with Button */}
                            <CardFooter className="p-4 mt-auto">
                                <Button
                                    size="lg"
                                    variant={plan.buttonVariant}
                                    className={cn(
                                        `w-full rounded-lg ${plan.buttonBgColor} ${plan.buttonTextColor}`,
                                        // Disable/style loading if auth is loading OR this specific plan payment is processing
                                        (isLoadingUser || isProcessingPayment === plan.id) && "opacity-70 cursor-not-allowed"
                                    )}
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isLoadingUser || isProcessingPayment === plan.id} // Disable button
                                >
                                    {/* Show appropriate loading state */}
                                    {isProcessingPayment === plan.id ? (
                                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                                    ) : isLoadingUser ? (
                                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading... </>
                                    ) : (
                                        plan.buttonText // Normal button text
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}