// components/Pricing.jsx (or your path)
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast'; // Added Toaster import
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define plan data (ensure IDs match backend PLANS config keys: 'starter', 'pro', 'accelerator')
// Use the latest plan details provided by the user
const pricingPlans = [
    {
        id: "starter",
        name: "Starter Pack",
        originalPrice: "₹ 299",
        price: "₹0",
        amount: 0, // Amount in paisa
        priceSuffix: "/ One Time",
        description: "Begin your journey with essential tools.",
        features: [
            "College Preference List Generator (3 Uses)",
            "Access to our MHTCET whatsapp community",
            "Essential Counselling Process Guide",
            "Category-Specific Document Checklist",
            "Previous Year MHT-CET Cutoffs",
            "Latest MHT-CET Updates",
        ],
        buttonText: "Select Free Plan",
        bgColor: "bg-white", textColor: "text-gray-900", buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white", buttonVariant: "default", badge: null, checkColor: "text-green-600",
    },
    {
        id: "pro",
        name: "Guidance Pro",
        originalPrice: "₹ 1599",
        price: "₹999",
        amount: 99900, // Amount in paisa
        priceSuffix: "/ One-Time",
        description: "Personalized guidance to boost your chances.",
        features: [
            "All Starter Pack Features",
            "Advanced College Preference List Generator (5 Uses)",
            "Personalized College Preference List [Expert-Curated]",
            "Expert-Curated Document Checklist",
            "Step by Step Guidance at every stage (Document verification, Registration, Form Filling, Freeze/Float/Betterment)",
            "Dedicated Group Support (WhatsApp)",
            "Guided Form Filling Assistance",
            "Exclusive Guidance Pro Community Access",
        ],
        buttonText: "Get Guidance Pro",
        bgColor: "bg-gray-800", textColor: "text-white", buttonBgColor: "bg-white hover:bg-gray-200",
        buttonTextColor: "text-gray-800", buttonVariant: "secondary", badge: "Most Popular",
        badgeStyle: "bg-white text-black", checkColor: "text-green-400",
    },
    {
        id: "accelerator",
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
            "Unlimited College List Generator Access",
        ],
        buttonText: "Accelerate Admission",
        bgColor: "bg-white", textColor: "text-gray-900", buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white", buttonVariant: "default", badge: null, checkColor: "text-green-600",
    },
];


export default function Pricing() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(null); // Tracks which plan button is loading

    // Define Backend API URL
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com";

    // --- Load Razorpay Script ---
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Cleanup script on component unmount
        return () => {
            const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);
    // --- End Load Razorpay Script ---


    // --- Fetch user status on component mount ---
    useEffect(() => {
        const fetchUserStatus = async () => {
            setIsLoadingUser(true);
            const profileUrl = `${baseApiUrl}/apiv1/users/getUserProfile`; // Use the users/getUserProfile endpoint
            console.log("Pricing: Attempting to fetch user status from:", profileUrl);

            try {
                const response = await axios.get(profileUrl, { withCredentials: true });
                console.log("Pricing: Received response from profile URL:", response.data);
                if (response.data && response.data.success && response.data.user) {
                    setUser(response.data.user);
                    console.log("Pricing: User authenticated:", response.data.user);
                } else {
                    setUser(null);
                    console.log("Pricing: User not authenticated or response format incorrect.");
                }
            } catch (error) {
                console.error("Pricing: Failed to fetch user status.", error.response?.data || error.message);
                setUser(null);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUserStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // --- End Fetch User Status ---


    // --- Handle Plan Selection and Initiate Razorpay Payment ---
    const handleSelectPlan = async (plan) => {
        if (isLoadingUser) {
            toast.loading("Checking authentication...");
            return;
        }

        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            toast.error("Please log in or sign up to select a plan.");
            router.push('/auth/login?redirect=/pricing'); // Redirect to login, then back to pricing
            return;
        }

        // Handle Free Plan (no payment needed)
        if (plan.amount === 0) {
            toast.success(`You have selected the ${plan.name}.`);
            // Optional: Call backend to update user's plan to 'starter' if needed
            // try {
            //     await axios.post(`${baseApiUrl}/apiv1/users/me/set-plan`, { planId: plan.id }, { withCredentials: true });
            //     toast.success(`${plan.name} activated!`);
            // } catch (error) { toast.error(`Failed to activate ${plan.name}.`); }
            return;
        }

        // Handle Paid Plan - Initiate Razorpay Order
        setIsProcessingPayment(plan.id);
        const loadingToastId = toast.loading(`Initiating payment for ${plan.name}...`);
        const paymentInitiateUrl = `${baseApiUrl}/apiv1/payments/initiate-plan`; // Backend endpoint to create Razorpay order

        try {
            // 1. Call backend to create Razorpay order
            const orderResponse = await axios.post(paymentInitiateUrl,
                { planId: plan.id }, // Send planId, backend gets userId from auth
                { withCredentials: true }
            );

            const orderResult = orderResponse.data;

            if (!orderResult.success || !orderResult.order_id) {
                throw new Error(orderResult.message || 'Failed to create payment order.');
            }

            console.log("Razorpay Order Created:", orderResult);

            // 2. Prepare Razorpay Checkout options
            const razorpayOptions = {
                key: orderResult.key_id, // Your Razorpay Key ID from backend
                amount: orderResult.amount, // Amount in paisa from backend
                currency: orderResult.currency,
                name: "Campus Sathi", // Your Brand Name
                description: `Payment for ${orderResult.planName || plan.name}`, // Description
                // image: "/your_logo.png", // Optional logo
                order_id: orderResult.order_id, // Crucial: Order ID from backend
                // --- Handler function called on successful payment in Razorpay modal ---
                handler: async function (response) {
                    console.log("Razorpay Success Response:", response);
                    const verifyUrl = `${baseApiUrl}/apiv1/payments/verify-razorpay`; // Your backend verification endpoint
                    const verificationToastId = toast.loading("Verifying payment...");

                    try {
                        // 3. Call backend to verify payment signature
                        const verifyRes = await axios.post(verifyUrl, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, { withCredentials: true }); // Send cookies for auth

                        if (verifyRes.data.success) {
                            toast.success("Payment Verified! Plan activated.", { id: verificationToastId });
                            // Redirect or update UI to reflect activated plan
                            router.push('/user-dashboard'); // Example redirect
                        } else {
                            throw new Error(verifyRes.data.message || "Payment verification failed on server.");
                        }
                    } catch (verifyError) {
                        console.error("Payment Verification Failed:", verifyError);
                        const errorMsg = verifyError.response?.data?.message || verifyError.message || 'Payment verification failed.';
                        toast.error(`Error: ${errorMsg}`, { id: verificationToastId });
                        // Redirect to payment status page with error?
                        // router.push('/payment-status?status=failure');
                    }
                },
                // --- Prefill user details ---
                prefill: orderResult.prefill || {},
                notes: orderResult.notes || {},
                theme: orderResult.theme || { color: '#4f46e5' }, // Default theme
                // --- Handler for payment failure within Razorpay modal ---
                modal: {
                    ondismiss: function() {
                        console.log('Razorpay checkout modal dismissed.');
                        toast.error('Payment process cancelled.');
                        setIsProcessingPayment(null); // Reset button loading state if modal is closed
                    }
                },
                 // You can also add a specific handler for payment failure events
                 // "handler" above is only called on SUCCESS within the modal
                 // To handle explicit failures reported by Razorpay:
                 // This needs to be configured carefully based on Razorpay's event structure
                 // Example (Conceptual - check Razorpay docs for exact event structure):
                 // payment_failed_handler: function (response) {
                 //    console.error("Razorpay Payment Failed Event:", response);
                 //    toast.error(`Payment Failed: ${response.error?.description || response.error?.reason || 'Unknown Razorpay error'}`);
                 // }
            };

            // Check if Razorpay script is loaded
            if (!window.Razorpay) {
                toast.error("Payment gateway script not loaded. Please refresh.", { id: loadingToastId });
                setIsProcessingPayment(null);
                return;
            }

            // 4. Open Razorpay Checkout Modal
            const rzp = new window.Razorpay(razorpayOptions);

            // Add event listener specifically for payment failure
            rzp.on('payment.failed', function (response){
                 console.error("Razorpay Payment Failed Event:", response.error);
                 const reason = response.error?.reason || 'Unknown error';
                 const description = response.error?.description || 'Payment could not be completed.';
                 toast.error(`Payment Failed: ${description} (Reason: ${reason})`);
                 // Optionally update parent error state or redirect
                 // setError(`Payment Failed: ${reason}`);
            });

            rzp.open();
            toast.dismiss(loadingToastId); // Dismiss "Initiating" toast once modal opens

        } catch (error) {
            console.error("Payment Initiation Failed:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Could not initiate payment.';
            toast.error(`Error: ${errorMessage}`, { id: loadingToastId });
        } finally {
            // Reset loading state ONLY if modal wasn't opened or if initiation failed before opening
             // If rzp.open() was called successfully, the modal dismiss/success handler should reset it.
             // However, adding it here ensures it resets if the try block fails before rzp.open()
             setIsProcessingPayment(null);
        }
    };

    return (
        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" /> {/* Ensure Toaster is present */}
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
                            className={cn(
                                "flex flex-col rounded-xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-2xl",
                                plan.bgColor,
                                plan.textColor,
                                plan.badge ? "ring-2 ring-offset-2 ring-indigo-500" : "border-gray-200"
                            )}
                        >
                            {plan.badge && (
                                <div className={cn(
                                    "absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-semibold rounded-full shadow-md",
                                    plan.badgeStyle || "bg-indigo-600 text-white"
                                )}>
                                    {plan.badge}
                                </div>
                            )}
                            <CardHeader className="p-6 text-center">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className={cn("mt-2 text-sm", plan.badge ? 'text-gray-300' : 'text-gray-500')}>
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow p-6 space-y-3">
                                <div className="mb-6 text-center">
                                    {plan.originalPrice && (
                                        <p className={cn("text-sm line-through", plan.badge ? 'text-gray-400' : 'text-gray-500')}>
                                            {plan.originalPrice}
                                        </p>
                                    )}
                                    <p className={cn("text-4xl font-extrabold", plan.badge ? 'text-white' : 'text-gray-900')}>
                                        {plan.price}
                                        <span className={cn("text-base font-medium ml-1", plan.badge ? 'text-gray-300' : 'text-gray-500')}>
                                            {plan.priceSuffix}
                                        </span>
                                    </p>
                                </div>
                                <ul className={cn("text-left space-y-2.5", plan.badge ? 'text-gray-200' : 'text-gray-700')}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <Check className={cn("h-5 w-5 mt-0.5 flex-shrink-0", plan.checkColor)} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="p-6 mt-auto">
                                <Button
                                    size="lg"
                                    variant={plan.buttonVariant}
                                    className={cn(
                                        `w-full rounded-lg font-semibold py-3 ${plan.buttonBgColor} ${plan.buttonTextColor}`,
                                        (isLoadingUser || isProcessingPayment === plan.id) && "opacity-70 cursor-not-allowed"
                                    )}
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isLoadingUser || isProcessingPayment === plan.id}
                                >
                                    {isProcessingPayment === plan.id ? (
                                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                                    ) : isLoadingUser && plan.amount > 0 ? (
                                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading... </>
                                    ) : (
                                        plan.buttonText
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