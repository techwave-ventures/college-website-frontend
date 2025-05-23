// components/Pricing.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
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
            "Access to our MHTCET WhatsApp community",
            "Essential Counselling Process Guide",
            "Category-Specific Document Checklist",
            "Previous Year MHT-CET Cutoffs",
            "Latest MHT-CET Updates",
        ],
        buttonText: "Get Started Free",
        bgColor: "bg-white", textColor: "text-gray-900", buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white", buttonVariant: "default", badge: null, checkColor: "text-green-600",
        collegeListLimit: 3
    },
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
            "Step by Step Guidance at every stage",
            "Spot Round / Donation Admission Guidance",
            "Dedicated Group Support (WhatsApp)",
            "Guided Form Filling Assistance",
            "Exclusive Guidance Pro Community Access",
        ],
        buttonText: "Get Guidance Pro",
        bgColor: "bg-gray-800", textColor: "text-white", buttonBgColor: "bg-white hover:bg-gray-200",
        buttonTextColor: "text-gray-800", buttonVariant: "secondary", badge: "Most Popular",
        badgeStyle: "bg-white text-black", checkColor: "text-green-400",
        collegeListLimit: 5
    }
];

const planOrder = { 'free': -1, 'starter': 0, 'pro': 1};

export default function Pricing() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [planData, setPlanData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [usageData, setUsageData] = useState({  collegeListGenerationLimit: 0, collegeListGenerationsUsed: 0  });
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

    // Derived state values
    const currentPlanId = planData?.id || 'free';
    const currentPlanLevel = planOrder[currentPlanId] ?? planOrder.free;
    const paymentStatus = planData?.status;
    const isAuthenticated = !!userData;

    // Razorpay script loading
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

    // Fetch user data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseApiUrl}/apiv1/users/me/plan-status`, { 
                    withCredentials: true 
                });
                if (res.data?.success) {
                    setUserData(res.data.user);
                    setPlanData(res.data.plan);
                    setUsageData(res.data.usage || { collegeListGenerationLimit: 0,collegeListGenerationsUsed: 0 });
                    console.log(res.data.usage);
                }
            } catch (error) {
                toast.error("Failed to load user data");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [baseApiUrl]);

    const handlePayment = async (type, planId = null) => {
        if (!userData) {
            router.push('/auth/login?redirect=/pricing');
            return toast.error("Please login first");
        }

        setIsProcessing(type);
        const loadingToast = toast.loading("Initializing payment...");

        try {
            const endpoint = type === 'plan' 
                ? `${baseApiUrl}/apiv1/payments/initiate-plan` 
                : `${baseApiUrl}/apiv1/payments/buy-limit`;
            
            const { data } = await axios.post(
                endpoint,
                type === 'plan' ? { planId } : { amount: 10000 },
                { withCredentials: true }
            );

            if (!data.order_id) throw new Error("Payment initialization failed");

            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: "Campus Sathi",
                description: data.description,
                order_id: data.order_id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            `${baseApiUrl}/apiv1/payments/verify-razorpay`,
                            response,
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            toast.success("Payment verified! Limits updated");
                            setUsageData(prev => ({
                                ...prev,
                                collegeListGenerationLimit: verifyRes.data.newLimit
                            }));
                            if (type === 'plan') {
                                setPlanData(verifyRes.data.plan);
                                router.push('/user-dashboard');
                            }
                        }
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: data.prefill,
                theme: { color: "#2563eb" },
                modal: { ondismiss: () => {
                    toast.error('Payment cancelled');
                    setIsProcessing(null);
                }}
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response) => {
                toast.error(`Payment failed: ${response.error.description}`);
                setIsProcessing(null);
            });
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment initialization failed");
        } finally {
            toast.dismiss(loadingToast);
            setIsProcessing(null);
        }
    };

    return (
        <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 md:py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="container mx-auto text-center">

                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Unlock Your Admission Success</h2>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Choose the perfect plan to navigate your college admission journey with confidence and expert support.</p>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch justify-center max-w-4xl mx-auto">
                    {pricingPlans.map((plan) => {
                        const isCurrentPlan = plan.id === currentPlanId;
                        const isPaidPlan = plan.amount > 0;
                        const isPlanCompleted = paymentStatus === 'Completed';
                        
                        let buttonText = plan.buttonText;
                        let isDisabled = isLoadingData || isProcessing === plan.id;

                        // Button state logic
                        if (isCurrentPlan) {
                            buttonText = isPlanCompleted ? "Current Plan" : "Complete Payment";
                            isDisabled = isPlanCompleted;
                        } else if (isPaidPlan || isPlanCompleted) {
                            if (planOrder[plan.id] <= currentPlanLevel && isPlanCompleted) {
                                buttonText = "Already Upgraded";
                                isDisabled = true;
                            }
                        }

                        if (!isAuthenticated && isPaidPlan) {
                            isDisabled = true;
                            buttonText = "Login to Purchase";
                        }

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "flex flex-col rounded-xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-2xl relative",
                                    plan.bgColor,
                                    plan.textColor,
                                    plan.badge ? "ring-2 ring-offset-2 ring-indigo-500" : "border-gray-200"
                                )}
                            >
                                {plan.badge && (
                                    <div className={cn(
                                        "absolute top-4 right-2 mr-1 transform", // Changed positioning
                                        "px-3 py-1 text-sm font-semibold rounded-full shadow-md",
                                        plan.badgeStyle
                                    )}>
                                        {plan.badge}
                                    </div>
                                )}

                                <CardHeader className="p-2 text-center">
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className={cn("mt-1 text-sm", plan.badge ? 'text-gray-300' : 'text-gray-500')}>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-grow p-4 space-y-1">
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

                                <CardFooter className="p-2 mt-auto justify-center">
                                    <Button
                                        size="lg"
                                        variant={plan.buttonVariant}
                                        className={cn(
                                            `w-3/4 rounded-lg font-semibold py-3 ${plan.buttonBgColor} ${plan.buttonTextColor}`,
                                            isDisabled && "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => handlePayment('plan', plan.id)}
                                        disabled={isDisabled}
                                    >
                                        {isProcessing === plan.id ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
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

                <div className="mb-4 mt-4">
                    <h2 className="text-3xl md:text-2xl font-bold mb-4 text-gray-800">
                        {isLoadingData ? (
                            <Loader2 className="h-8 w-8 animate-spin inline" />
                        ) : (
                            `College List Generations Left: ${
                                (typeof usageData.collegeListGenerationLimit === 'number' && 
                                typeof usageData.collegeListGenerationsUsed === 'number') 
                                ? usageData.collegeListGenerationLimit - usageData.collegeListGenerationsUsed
                                : 0
                            }`
                        )}
                    </h2>
                    <Button 
                        onClick={() => handlePayment('limit')}
                        disabled={isProcessing === 'limit' || isLoadingData}
                        className="bg-gray-600 hover:bg-gray-800 text-white"
                    >
                        {isProcessing === 'limit' ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                        ) : "Buy Additional Limit (₹100)"}
                    </Button>
                </div>
            </div>
        </section>
    );
}