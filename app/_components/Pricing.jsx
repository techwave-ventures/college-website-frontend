// components/Pricing.jsx (or your path)
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Define plan data
const pricingPlans = [
    // Starter Plan...
    {
        id: "starter",
        name: "Starter Pack",
        originalPrice: "₹ 299",
        price: "₹0",
        amount: 0,
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
    // Guidance Pro Plan...
    {
        id: "pro",
        name: "Guidance Pro",
        originalPrice: "₹ 1599",
        price: "₹999",
        amount: 99900,
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
    // Admission Accelerator Plan...
    {
        id: "accelerator",
        name: "Admission Accelerator",
        originalPrice: "₹ 3199",
        price: "₹1599",
        amount: 159900,
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

// --- Define Plan Hierarchy ---
const planOrder = {
    starter: 0,
    pro: 1,
    accelerator: 2
};
// --- End Plan Hierarchy ---


export default function Pricing() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(null);

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existingScript) document.body.removeChild(existingScript);
        };
    }, []);

    // Fetch user status
    useEffect(() => {
        const fetchUserStatus = async () => {
            setIsLoadingUser(true);
            const profileUrl = `${baseApiUrl}/apiv1/users/getUserProfile`;
            console.log("Pricing: Attempting to fetch user status from:", profileUrl);
            try {
                const response = await axios.get(profileUrl, { withCredentials: true });
                console.log("Pricing: Received response from profile URL:", response.data);
                if (response.data?.success && response.data?.user) {
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
    }, [baseApiUrl]);


    // Handle Plan Selection
    const handleSelectPlan = async (selectedPlan) => { // Removed type annotation from selectedPlan
        if (isLoadingUser) {
            toast.loading("Checking authentication...");
            return;
        }

        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            toast.error("Please log in or sign up to select a plan.");
            router.push('/auth/login?redirect=/pricing');
            return;
        }

        // --- Upgrade Logic ---
        const currentUserPlanId = user.counselingPlan || 'starter';
        const currentUserPlanLevel = planOrder[currentUserPlanId] ?? -1;
        const selectedPlanLevel = planOrder[selectedPlan.id];

        if (selectedPlan.amount === 0) {
             if (currentUserPlanLevel <= 0) {
                toast.success(`You have selected the ${selectedPlan.name}.`);
                // Optional: Backend call to set plan to 'starter'
             } else {
                 toast("You are already on a higher plan.", { icon: 'ℹ️' });
             }
            return;
        }

        if (selectedPlanLevel <= currentUserPlanLevel) {
            toast.error("You can only upgrade to a higher plan.");
            return;
        }
        // --- End Upgrade Logic ---

        setIsProcessingPayment(selectedPlan.id);
        const loadingToastId = toast.loading(`Initiating payment for ${selectedPlan.name}...`);
        const paymentInitiateUrl = `${baseApiUrl}/apiv1/payments/initiate-plan`;

        try {
            const orderResponse = await axios.post(paymentInitiateUrl,
                { planId: selectedPlan.id },
                { withCredentials: true }
            );
            const orderResult = orderResponse.data;

            if (!orderResult.success || !orderResult.order_id) {
                throw new Error(orderResult.message || 'Failed to create payment order.');
            }

            console.log("Razorpay Order Created:", orderResult);

            const razorpayOptions = {
                key: orderResult.key_id,
                amount: orderResult.amount,
                currency: orderResult.currency,
                name: "Campus Sathi",
                description: `Payment for ${orderResult.planName || selectedPlan.name}`,
                order_id: orderResult.order_id,
                handler: async function (response) { // Removed type annotation from response
                    console.log("Razorpay Success Response:", response);
                    const verifyUrl = `${baseApiUrl}/apiv1/payments/verify-razorpay`;
                    const verificationToastId = toast.loading("Verifying payment...");
                    try {
                        const verifyRes = await axios.post(verifyUrl, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, { withCredentials: true });

                        if (verifyRes.data.success) {
                            toast.success("Payment Verified! Plan activated.", { id: verificationToastId });
                            const updatedUserResponse = await axios.get(`${baseApiUrl}/apiv1/users/getUserProfile`, { withCredentials: true });
                            if (updatedUserResponse.data?.success && updatedUserResponse.data?.user) {
                                setUser(updatedUserResponse.data.user);
                            }
                            router.push('/payment-status?status=success');
                        } else {
                            throw new Error(verifyRes.data.message || "Payment verification failed.");
                        }
                    } catch (verifyError) { // Removed type annotation from verifyError
                        console.error("Payment Verification Failed:", verifyError);
                        const errorMsg = verifyError.response?.data?.message || verifyError.message || 'Payment verification failed.';
                        toast.error(`Error: ${errorMsg}`, { id: verificationToastId });
                        router.push('/payment-status?status=failure');
                    }
                },
                prefill: orderResult.prefill || {},
                notes: orderResult.notes || {},
                theme: orderResult.theme || { color: '#4f46e5' },
                modal: {
                    ondismiss: function() {
                        console.log('Razorpay checkout modal dismissed.');
                        toast.error('Payment process cancelled.');
                        setIsProcessingPayment(null);
                    }
                },
            };

            if (!window.Razorpay) {
                toast.error("Payment gateway script not loaded. Please refresh.", { id: loadingToastId });
                setIsProcessingPayment(null);
                return;
            }

            const rzp = new window.Razorpay(razorpayOptions);
            rzp.on('payment.failed', function (response){ // Removed type annotation from response
                 console.error("Razorpay Payment Failed Event:", response.error);
                 const reason = response.error?.reason || 'Unknown error';
                 const description = response.error?.description || 'Payment could not be completed.';
                 toast.error(`Payment Failed: ${description} (Reason: ${reason})`);
                 router.push('/payment-status?status=failure');
            });

            rzp.open();
            toast.dismiss(loadingToastId);

        } catch (error) { // Removed type annotation from error
            console.error("Payment Initiation Failed:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Could not initiate payment.';
            toast.error(`Error: ${errorMessage}`, { id: loadingToastId });
            setIsProcessingPayment(null);
        }
    };

    // Determine current user plan level for disabling buttons
    const currentUserPlanLevel = React.useMemo(() => { // Use React.useMemo if not importing useMemo directly
        if (!user || !user.counselingPlan) return planOrder.starter;
        return planOrder[user.counselingPlan] ?? planOrder.starter;
    }, [user]);

    return (
        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    Unlock Your Admission Success
                </h2>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                    Choose the perfect plan to navigate your college admission journey with confidence and expert support.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {pricingPlans.map((plan) => {
                        const planLevel = planOrder[plan.id];
                        const isAuthenticated = !!user; // Check auth status inside map if needed
                        const isDowngradeOrSame = isAuthenticated && planLevel <= currentUserPlanLevel;
                        const disableButton = isLoadingUser ||
                                              isProcessingPayment === plan.id ||
                                              (isAuthenticated && plan.amount > 0 && isDowngradeOrSame);

                        let buttonText = plan.buttonText;
                        if (isAuthenticated && plan.id === user?.counselingPlan) {
                            buttonText = "Current Plan";
                        } else if (disableButton && plan.amount > 0) {
                             buttonText = "Upgrade Unavailable";
                        }

                        return (
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
                                        {plan.originalPrice && ( <p className={cn("text-sm line-through", plan.badge ? 'text-gray-400' : 'text-gray-500')}>{plan.originalPrice}</p> )}
                                        <p className={cn("text-4xl font-extrabold", plan.badge ? 'text-white' : 'text-gray-900')}>
                                            {plan.price}
                                            <span className={cn("text-base font-medium ml-1", plan.badge ? 'text-gray-300' : 'text-gray-500')}>{plan.priceSuffix}</span>
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
                                            disableButton && "opacity-50 cursor-not-allowed hover:opacity-50"
                                        )}
                                        onClick={() => handleSelectPlan(plan)}
                                        disabled={disableButton || isProcessingPayment === plan.id}
                                    >
                                        {isProcessingPayment === plan.id ? (
                                            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                                        ) : isLoadingUser && plan.amount > 0 ? (
                                            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading... </>
                                        ) : (
                                            buttonText
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
