// components/UserDashboard.jsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    User, Mail, Phone, CheckCircle, XCircle, // Basic Info
    BookOpen, ListChecks, BarChart3, CalendarClock, // Guides, Checklists, Cutoffs, Updates
    Wand2, // Generator
    MessageSquare, Users, CalendarPlus, FileText, // Pro Features
    Star, PhoneCall, UserCheck, // Accelerator Features (some overlap)
    Loader2, AlertCircle, ExternalLink, Info // UI Elements & Icons
} from "lucide-react";
import { cn } from "@/lib/utils"; // *** IMPORT ADDED HERE ***

import Link from 'next/link'; // For internal navigation

// Define feature availability based on plan IDs (matches backend PLANS keys)
const planFeatures = {
    starter: [
        "guide", "checklist", "cutoffs", "updates", "generator"
    ],
    pro: [
        "guide", "checklist", "cutoffs", "updates", "generator",
        "groupSupport", "expertSession", "groupFormFilling", "communityAccess"
    ],
    accelerator: [
        "guide", "checklist", "cutoffs", "updates", "generator",
        "groupSupport", "expertSession", "groupFormFilling", "communityAccess", // Inherits Pro
        "prioritySupport", "oneOnOneCounseling", "curatedList", "oneOnOneFormFilling", "donationGuidance" // Accelerator specific
    ]
};

// Feature details map
const featureDetails = {
    guide: { icon: BookOpen, title: "Counselling Process Guide", description: "Essential steps and information.", link: "/guides/counselling-process", type: 'link' },
    checklist: { icon: ListChecks, title: "Document Checklist", description: "Category-specific required documents.", link: "/guides/document-checklist", type: 'link' },
    cutoffs: { icon: BarChart3, title: "Previous Year Cutoffs", description: "MHT-CET cutoff data.", link: "/data/cutoffs", type: 'link' },
    updates: { icon: CalendarClock, title: "Latest MHT-CET Updates", description: "Stay informed on news and dates.", link: "/updates", type: 'link' },
    generator: { icon: Wand2, title: "College List Generator", description: "Generate potential college lists.", link: "/pref-list-generator", type: 'link' },
    groupSupport: { icon: MessageSquare, title: "Dedicated Group Support", description: "Get help via WhatsApp group.", link: "#whatsapp-group", type: 'external' }, // Placeholder link
    expertSession: { icon: CalendarPlus, title: "Personalized Expert Session", description: "Book your 30-min session.", link: "/booking/expert-session", type: 'link' },
    groupFormFilling: { icon: FileText, title: "Guided Group Form Filling", description: "Assistance with application forms.", link: "/guides/form-filling", type: 'link' },
    communityAccess: { icon: Users, title: "Exclusive Community Access", description: "Join our private community.", link: "#community", type: 'external' }, // Placeholder link
    prioritySupport: { icon: Star, title: "Priority WhatsApp Support", description: "Faster responses via WhatsApp.", link: "#priority-whatsapp", type: 'external' }, // Placeholder link
    oneOnOneCounseling: { icon: UserCheck, title: "In-Depth 1-on-1 Counselling", description: "Detailed personalized guidance.", link: "/booking/one-on-one", type: 'link' },
    curatedList: { icon: ListChecks, title: "Expert-Curated Preference List", description: "Receive a list tailored for you.", link: "/user/preference-list", type: 'link' }, // Example link
    oneOnOneFormFilling: { icon: FileText, title: "Dedicated 1-on-1 Form Filling", description: "Personalized form support.", link: "/booking/form-filling", type: 'link' },
    donationGuidance: { icon: Info, title: "Donation Admission Guidance", description: "Information on alternative admissions.", link: "/guides/donation-admission", type: 'link' },
};


export default function UserDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Define Backend API URL
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main.onrender.com";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            // Endpoint that returns user profile + plan details + usage
            const detailsUrl = `${baseApiUrl}/apiv1/users/me/plan-status`;
            console.log("UserDashboard: Fetching data from:", detailsUrl);

            try {
                const response = await axios.get(detailsUrl, {
                    withCredentials: true, // Send cookies
                });

                console.log("UserDashboard: Received response:", response.data);

                if (response.data && response.data.success) {
                    setDashboardData(response.data);
                } else {
                    throw new Error(response.data.message || "Failed to fetch dashboard data.");
                }
            } catch (err) {
                console.error("UserDashboard: Error fetching data:", err.response?.data || err.message);
                let errorMsg = "Could not load dashboard data.";
                if (err.response?.status === 401 || err.response?.status === 403) {
                    errorMsg = "Authentication failed. Please log in again.";
                    // Redirect to login after a short delay
                    toast.error(errorMsg);
                    setTimeout(() => router.push('/auth/login'), 1500);
                } else {
                    errorMsg = err.response?.data?.message || err.message || errorMsg;
                    toast.error(errorMsg);
                }
                setError(errorMsg);
                setDashboardData(null); // Clear any stale data
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // Render Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            </div>
        );
    }

    // Render Error State
    if (error && !dashboardData) { // Only show full error if no data loaded at all
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Render Dashboard Content
    const { user, plan, usage } = dashboardData || {}; // Destructure safely
    const currentPlanId = plan?.id || 'starter'; // Default to starter if plan is null/undefined
    const availableFeatures = planFeatures[currentPlanId] || planFeatures.starter; // Get features for current plan

    // Helper to format usage limit
    const formatLimit = (limit) => (limit === Infinity ? 'Unlimited' : limit);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            {/* Welcome Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome back, {user?.name || 'User'}!
            </h1>

             {/* Display general errors if data partially loaded */}
             {error && (
                 <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
             )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Column 1: Profile & Plan */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> Your Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <User className="h-4 w-4" />
                                <span>{user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="h-4 w-4" />
                                <span>{user?.email || 'N/A'}</span>
                            </div>
                            {/* Add phone number if available in user object */}
                            {/* <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="h-4 w-4" />
                                <span>{user?.phoneNumber || 'N/A'}</span>
                            </div> */}
                        </CardContent>
                        {/* Optional: Add link to edit profile */}
                         {/* <CardFooter>
                           <Button variant="outline" size="sm" onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
                         </CardFooter> */}
                    </Card>

                    {/* Plan & Usage Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" /> Current Plan
                            </CardTitle>
                            <CardDescription>Your active subscription details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Plan Name:</span>
                                <Badge variant={plan?.id === 'starter' ? "secondary" : "default"}>
                                    {plan?.name || 'N/A'}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-baseline text-sm font-medium text-gray-700">
                                    <span>Generator Usage:</span>
                                    <span>
                                        {usage?.collegeListGenerationsUsed ?? 0} / {formatLimit(usage?.collegeListGenerationLimit ?? 0)}
                                    </span>
                                </div>
                                {usage?.collegeListGenerationLimit > 0 && usage?.collegeListGenerationLimit !== Infinity && (
                                     <Progress
                                        value={((usage?.collegeListGenerationsUsed ?? 0) / usage?.collegeListGenerationLimit) * 100}
                                        className="h-2"
                                    />
                                )}
                                 {usage?.collegeListGenerationLimit === Infinity && (
                                    <p className="text-xs text-green-600 text-right">Unlimited Usage</p>
                                 )}
                            </div>
                             <div className="text-xs text-gray-500">
                                Status: <span className={cn(
                                    plan?.status === 'Completed' ? 'text-green-600' :
                                    plan?.status === 'Pending' ? 'text-yellow-600' :
                                    plan?.status === 'Failed' ? 'text-red-600' : ''
                                )}>{plan?.status || 'Active (Free)'}</span>
                                {plan?.activationDate && ` | Activated: ${new Date(plan.activationDate).toLocaleDateString()}`}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" onClick={() => router.push('/pricing')}>
                                View Plans / Upgrade
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Column 2: Features */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Features & Resources</CardTitle>
                            <CardDescription>Access the tools and guides included in your plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {availableFeatures.map((featureKey) => {
                                const feature = featureDetails[featureKey];
                                if (!feature) return null; // Skip if feature details not found

                                const Icon = feature.icon;
                                const isExternal = feature.type === 'external';
                                const isGenerator = featureKey === 'generator';

                                return (
                                    <div key={featureKey} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon className="h-6 w-6 text-gray-700" />
                                                <h3 className="font-semibold text-base text-gray-800">{feature.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                                            {isGenerator && usage && (
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Usage: {usage.collegeListGenerationsUsed} / {formatLimit(usage.collegeListGenerationLimit)}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => {
                                                if (isExternal) {
                                                    window.open(feature.link, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    router.push(feature.link);
                                                }
                                            }}
                                            className="w-full mt-auto bg-black hover:bg-gray-800 text-white"
                                            disabled={isGenerator && usage?.collegeListGenerationsUsed >= usage?.collegeListGenerationLimit} // Disable generator if limit reached
                                        >
                                            {isGenerator ? 'Go to Generator' : isExternal ? 'Access Link' : 'View Resource'}
                                            {isExternal && <ExternalLink className="ml-2 h-3 w-3" />}
                                        </Button>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
