// // components/UserDashboard.jsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import toast, { Toaster } from 'react-hot-toast';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//     User, Mail, Phone, CheckCircle, XCircle,
//     BookOpen, ListChecks, BarChart3, CalendarClock,
//     Wand2,
//     MessageSquare, Users, CalendarPlus, FileText,
//     Star, PhoneCall, UserCheck,
//     Info,
//     Loader2, AlertCircle, ExternalLink, Lock
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Link from 'next/link';

// // --- Define Feature Keys and Details ---
// const featureDetails = {
//     // Starter Features
//     generator_basic: { icon: Wand2, title: "College List Generator (Basic)", description: "Generate potential college lists.", link: "/pref-list-generator", type: 'link' },
//     whatsapp_community: { icon: MessageSquare, title: "WhatsApp Community Access", description: "Join the general MHTCET group.", link: "https://chat.whatsapp.com/LFSzcsrP4MrLWQcjMTg19Y", type: 'external' },
//     guide: { icon: BookOpen, title: "Counselling Process Guide", description: "Essential steps and information.", link: "/blogs/MHTCET/mht-cet-counselling-process", type: 'link' },
//     checklist: { icon: ListChecks, title: "Document Checklist", description: "Category-specific required documents.", link: "/blogs/MHTCET/document-checklist", type: 'link' },
//     cutoffs: { icon: BarChart3, title: "Previous Year Cutoffs", description: "Explore MHT-CET cutoff data.", link: "/blogs/MHTCET/mht-cet-cutoff-explorer", type: 'link' },
//     updates: { icon: CalendarClock, title: "Latest MHT-CET Updates", description: "Stay informed on news and dates.", link: "/blogs/MHTCET", type: 'link' },

//     // Pro Features
//     generator_advanced: { icon: Wand2, title: "College List Generator (Advanced)", description: "Generate more refined lists.", link: "/pref-list-generator", type: 'link' },
//     pro_curated_list: { icon: ListChecks, title: "Personalized Preference List", description: "Receive an expert-curated list.", link: null, type: 'info' },
//     pro_doc_checklist: { icon: ListChecks, title: "Expert-Curated Document Checklist", description: "Personalized check based on your profile.", link: null, type: 'info' },
//     step_by_step_guidance: { icon: UserCheck, title: "Guidance at each step of Admission", description: "Support for Registration, Document verification, Option Form Filling, Making Choices. Keep checking user dashboard for further details.", link: null, type: 'info' },
//     pro_group_support: { icon: MessageSquare, title: "Dedicated Group Support", description: "Access the Guidance Pro WhatsApp group.", link: "https://chat.whatsapp.com/HUytUg1PDcp2Qi4FlNquzm", type: 'external' },
//     guided_form_filling: { icon: FileText, title: "Guided Form Filling Assistance", description: "Help during the application process.", link: null, type: 'info' },
//     pro_community: { icon: Users, title: "Exclusive Pro Community", description: "Join the private Guidance Pro community.", link: "https://chat.whatsapp.com/HUytUg1PDcp2Qi4FlNquzm", type: 'external' },

//     // Accelerator Features
//     priority_support: { icon: Star, title: "Priority WhatsApp Support", description: "Faster responses via dedicated support.", link: "https://chat.whatsapp.com/FrFvuSNV1pj91sq5ntawWm", type: 'external' },
//     accelerator_community: { icon: Users, title: "Exclusive Accelerator Community", description: "Join the premium Accelerator community.", link: "https://chat.whatsapp.com/FrFvuSNV1pj91sq5ntawWm", type: 'external' },
//     one_on_one_counseling: { icon: PhoneCall, title: "In-Depth 1-on-1 Counselling", description: "Support for Registration, Document verification, Option Form Filling, Making Choices. Links will be enabled from 15th May. Keep checking user dashboard for further details.", link: null, type: 'info' },
//     accelerator_curated_list: { icon: ListChecks, title: "Expert-Curated Personalised List", description: "Highly tailored preference list.", link: null, type: 'info' },
//     one_on_one_form_filling: { icon: FileText, title: "Dedicated 1-on-1 Form Filling", description: "Personalized assistance with forms.", link: "/one-on-one-counseling", type: 'link' },
//     spot_round_guidance: { icon: Info, title: "Spot Round / Donation Guidance", description: "Guidance on alternative admissions. Call: +91 9209143384", link: null, type: 'info' },
//     generator_unlimited: { icon: Wand2, title: "College List Generator (Unlimited)", description: "Unlimited access to generate lists.", link: "/pref-list-generator", type: 'link' },
// };


// // --- Define features available for each plan ID ---
// const planFeatures = {
//     starter: [
//         "generator_basic", "whatsapp_community", "guide", "checklist", "cutoffs", "updates"
//     ],
//     pro: [
//         "generator_advanced", "whatsapp_community", "guide", "checklist", "cutoffs", "updates",
//         "pro_group_support", "pro_community",
//         "one_on_one_counseling", "step_by_step_guidance",
//         "pro_curated_list", "pro_doc_checklist",
//         "guided_form_filling"
//     ],
//     accelerator: [
//         "generator_unlimited", "whatsapp_community", "guide", "checklist", "cutoffs", "updates",
//         "priority_support", "accelerator_community", "one_on_one_counseling",
//         "step_by_step_guidance", "pro_curated_list",
//         "accelerator_curated_list", "one_on_one_form_filling", "spot_round_guidance"
//     ]
// };
// // --- End Feature Definitions ---


// export default function UserDashboard() {
//     const [dashboardData, setDashboardData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const router = useRouter();

//     const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             setIsLoading(true);
//             setError(null);
//             const detailsUrl = `${baseApiUrl}/apiv1/users/me/plan-status`;
//             console.log("UserDashboard: Fetching data from:", detailsUrl);
//             try {
//                 const response = await axios.get(detailsUrl, { withCredentials: true });
//                 console.log("UserDashboard: Received response:", response.data);
//                 if (response.data && response.data.success) {
//                     setDashboardData(response.data);
//                 } else {
//                     throw new Error(response.data.message || "Failed to fetch dashboard data.");
//                 }
//             } catch (err) {
//                 console.error("UserDashboard: Error fetching data:", err.response?.data || err.message);
//                 let errorMsg = "Could not load dashboard data.";
//                 if (err.response?.status === 401 || err.response?.status === 403) {
//                     errorMsg = "Authentication failed. Please log in again.";
//                     toast.error(errorMsg);
//                     setTimeout(() => router.push('/auth/login'), 1500);
//                 } else {
//                     errorMsg = err.response?.data?.message || err.message || errorMsg;
//                     toast.error(errorMsg);
//                 }
//                 setError(errorMsg);
//                 setDashboardData(null);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchDashboardData();
//     }, [baseApiUrl, router]);

//     // Render Loading State
//     if (isLoading) {
//         return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-gray-500" /></div> );
//     }

//     // Render Error State (for initial load failure)
//     if (error && !dashboardData) {
//         return ( <div className="container mx-auto p-4 md:p-6 lg:p-8"><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Dashboard</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );
//     }

//     // Render Dashboard Content
//     const { user, plan, usage } = dashboardData || {};
//     const currentPlanId = plan?.id || 'starter';
//     const availableFeatureKeys = planFeatures[currentPlanId] || planFeatures.starter;
//     const formatLimit = (limit) => (limit === Infinity ? 'Unlimited' : limit);

//     // --- FIX: Use usage and limit directly from the API response ---
//     const generatorUsage = usage?.prefListGenerationsUsed ?? 0;
//     const generatorLimit = usage?.prefListGenerationLimit ?? 0; // Use limit from API response
//     // --- End Fix ---

//     const generatorProgress = generatorLimit > 0 && generatorLimit !== Infinity ? ((generatorUsage / generatorLimit) * 100) : (generatorLimit === Infinity ? 100 : 0);


//     return (
//         <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
//             <Toaster position="top-right" />
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}!</h1>

//             {error && dashboardData && ( // Show only if data loaded but there was still some error reported
//                  <Alert variant="warning" className="mt-4"> {/* Use warning variant for non-critical */}
//                      <AlertCircle className="h-4 w-4" />
//                      <AlertTitle>Notice</AlertTitle>
//                      <AlertDescription>{error}</AlertDescription>
//                  </Alert>
//              )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//                 {/* Column 1: Profile & Plan */}
//                 <div className="lg:col-span-1 space-y-6">
//                     {/* Profile Card */}
//                     <Card>
//                         <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Your Profile</CardTitle></CardHeader>
//                         <CardContent className="space-y-3 text-sm">
//                             <div className="flex items-center gap-2 text-gray-700"><User className="h-4 w-4" /><span>{user?.name || 'N/A'}</span></div>
//                             <div className="flex items-center gap-2 text-gray-700"><Mail className="h-4 w-4" /><span>{user?.email || 'N/A'}</span></div>
//                             {user?.phoneNumber && (<div className="flex items-center gap-2 text-gray-700"><Phone className="h-4 w-4" /><span>{user.phoneNumber}</span></div>)}
//                         </CardContent>
//                     </Card>
//                     {/* Plan & Usage Card */}
//                     <Card>
//                         <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Current Plan</CardTitle><CardDescription>Your active subscription details.</CardDescription></CardHeader>
//                         <CardContent className="space-y-4">
//                             <div className="flex justify-between items-center"><span className="font-medium text-gray-700">Plan Name:</span><Badge variant={plan?.id === 'starter' ? "secondary" : "default"}>{plan?.name || 'Starter'}</Badge></div>
//                             <div className="space-y-2"><div className="flex justify-between items-baseline text-sm font-medium text-gray-700"><span>Generator Usage:</span><span>{generatorUsage} / {formatLimit(generatorLimit)}</span></div><Progress value={generatorProgress} className="h-2" aria-label={`${generatorProgress}% generator usage`} />{generatorLimit === Infinity && (<p className="text-xs text-green-600 text-right">Unlimited Usage</p>)}</div>
//                             <div className="text-xs text-gray-500">Status: <span className={cn( plan?.status === 'Completed' ? 'text-green-600' : plan?.status === 'Pending' ? 'text-yellow-600' : plan?.status === 'Failed' ? 'text-red-600' : '' )}>{plan?.status || (plan?.id === 'starter' ? 'Active' : 'N/A')}</span>{plan?.activationDate && ` | Activated: ${new Date(plan.activationDate).toLocaleDateString()}`}</div>
//                         </CardContent>
//                         <CardFooter><Button variant="outline" size="sm" onClick={() => router.push('/pricing')}>View Plans / Upgrade</Button></CardFooter>
//                     </Card>
//                 </div>
//                 {/* Column 2: Features */}
//                 <div className="lg:col-span-2">
//                     <Card>
//                         <CardHeader><CardTitle>Your Features & Resources</CardTitle><CardDescription>Access the tools and guides included in your plan.</CardDescription></CardHeader>
//                         <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {availableFeatureKeys.map((featureKey) => {
//                                 const feature = featureDetails[featureKey];
//                                 if (!feature) { console.warn(`Feature details not found for key: ${featureKey}`); return null; }
//                                 const Icon = feature.icon;
//                                 const isExternal = feature.type === 'external';
//                                 const isInfoOnly = feature.type === 'info';
//                                 const isGeneratorFeature = featureKey.startsWith('generator_');
//                                 // --- FIX: Use generatorLimit and generatorUsage directly ---
//                                 let limit = isGeneratorFeature ? generatorLimit : Infinity;
//                                 let used = isGeneratorFeature ? generatorUsage : 0;
//                                 // --- End Fix ---
//                                 const isDisabled = isGeneratorFeature && limit !== Infinity && used >= limit;
//                                 return (
//                                     <div key={featureKey} className={cn(
//                                         "p-4 border rounded-lg bg-white flex flex-col justify-between",
//                                         {
//                                             "bg-gray-100 opacity-70": isDisabled,
//                                             "hover:shadow-md transition-shadow duration-200": !isDisabled
//                                         }
//                                     )}>
//                                         <div>
//                                             <div className="flex items-center gap-3 mb-2">
//                                                 <Icon className={cn("h-6 w-6", isDisabled ? "text-gray-400" : "text-gray-700")} />
//                                                 <h3 className={cn("font-semibold text-base", isDisabled ? "text-gray-500" : "text-gray-800")}>{feature.title}</h3>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
//                                             {isGeneratorFeature && (<p className="text-xs text-gray-500 mb-3">Usage: {used} / {formatLimit(limit)}</p>)}
//                                         </div>
//                                         {!isInfoOnly && (
//                                             <Button
//                                                 variant="default"
//                                                 size="sm"
//                                                 onClick={() => {
//                                                     if (isDisabled) { toast.error("Usage limit reached for this feature."); return; }
//                                                     if (isExternal) { if (feature.link && feature.link !== '#') { window.open(feature.link, '_blank', 'noopener,noreferrer'); } else { toast.error("Link not available yet."); } }
//                                                     else if (feature.link) { router.push(feature.link); }
//                                                     else { toast.error("Resource not available yet."); }
//                                                 }}
//                                                 className={cn("w-full mt-auto", isDisabled ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white")}
//                                                 disabled={isDisabled || !feature.link || feature.link === '#'}
//                                             >
//                                                 {isGeneratorFeature ? 'Go to Generator' : isExternal ? 'Access Link' : 'View Resource'}
//                                                 {isExternal && !isDisabled && feature.link && feature.link !== '#' && <ExternalLink className="ml-2 h-3 w-3" />}
//                                                 {isDisabled && <Lock className="ml-2 h-3 w-3" />}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }











// components/UserDashboard.jsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Dialog Imports
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    // DialogTrigger, // No longer using DialogTrigger directly in the map for this button
    DialogClose,
} from "@/components/ui/dialog";
import {
    User, Mail, Phone, CheckCircle, XCircle,
    BookOpen, ListChecks, BarChart3, CalendarClock,
    Wand2,
    MessageSquare, Users, CalendarPlus, FileText,
    Star, PhoneCall, UserCheck,
    Info,
    Loader2, AlertCircle, ExternalLink, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- Define Feature Keys and Details ---
const featureDetails = {
    // Starter Features
    generator_basic: { icon: Wand2, title: "College List Generator (Basic)", description: "Generate potential college lists.", link: "/pref-list-generator", type: 'link' },
    whatsapp_community: { icon: MessageSquare, title: "WhatsApp Community Access", description: "Join the general MHTCET group.", link: "https://chat.whatsapp.com/LFSzcsrP4MrLWQcjMTg19Y", type: 'external' },
    guide: { icon: BookOpen, title: "Counselling Process Guide", description: "Essential steps and information.", link: "/blogs/MHTCET/mht-cet-counselling-process", type: 'link' },
    checklist: { icon: ListChecks, title: "Document Checklist", description: "Category-specific required documents.", link: "/blogs/MHTCET/document-checklist", type: 'link' },
    cutoffs: { icon: BarChart3, title: "Previous Year Cutoffs", description: "Explore MHT-CET cutoff data.", link: "/blogs/MHTCET/mht-cet-cutoff-explorer", type: 'link' },
    updates: { icon: CalendarClock, title: "Latest MHT-CET Updates", description: "Stay informed on news and dates.", link: "/blogs/MHTCET", type: 'link' },

    // Pro Features
    generator_advanced: { icon: Wand2, title: "College List Generator (Advanced)", description: "Generate more refined lists.", link: "/pref-list-generator", type: 'link' },
    pro_curated_list: { icon: ListChecks, title: "Personalized Preference List", description: "Receive an expert-curated list.", link: null, type: 'info' },
    pro_doc_checklist: { icon: ListChecks, title: "Expert-Curated Document Checklist", description: "Personalized check based on your profile.", link: null, type: 'info' },
    step_by_step_guidance: { icon: UserCheck, title: "Guidance at each step of Admission", description: "Support for Registration, Document verification, Option Form Filling, Making Choices. Keep checking user dashboard for further details.", link: null, type: 'info' },
    pro_group_support: { icon: MessageSquare, title: "Dedicated Group Support", description: "Access the Guidance Pro WhatsApp group.", link: "https://chat.whatsapp.com/HUytUg1PDcp2Qi4FlNquzm", type: 'external' },
    guided_form_filling: { icon: FileText, title: "Guided Form Filling Assistance", description: "Help during the application process.", link: null, type: 'info' },
    pro_community: { icon: Users, title: "Exclusive Pro Community", description: "Join the private Guidance Pro community.", link: "https://chat.whatsapp.com/HUytUg1PDcp2Qi4FlNquzm", type: 'external' },

    // Accelerator Features
    priority_support: { icon: Star, title: "Priority WhatsApp Support", description: "Faster responses via dedicated support.", link: "https://chat.whatsapp.com/FrFvuSNV1pj91sq5ntawWm", type: 'external' },
    accelerator_community: { icon: Users, title: "Exclusive Accelerator Community", description: "Join the premium Accelerator community.", link: "https://chat.whatsapp.com/FrFvuSNV1pj91sq5ntawWm", type: 'external' },
    one_on_one_counseling: { icon: PhoneCall, title: "In-Depth 1-on-1 Counselling", description: "Personalized sessions to discuss your profile, preferences, and strategy.", link: null, type: 'dialog' }, // Type 'dialog' will trigger manual state change
    accelerator_curated_list: { icon: ListChecks, title: "Expert-Curated Personalised List", description: "Highly tailored preference list.", link: null, type: 'info' },
    one_on_one_form_filling: { icon: FileText, title: "Dedicated 1-on-1 Form Filling", description: "Personalized assistance with forms.", link: null, type: 'info' },
    spot_round_guidance: { icon: Info, title: "Spot Round / Donation Guidance", description: "Guidance on alternative admissions. Call: +91 9209143384", link: null, type: 'info' },
    generator_unlimited: { icon: Wand2, title: "College List Generator (Unlimited)", description: "Unlimited access to generate lists.", link: "/pref-list-generator", type: 'link' },
};

const planFeatures = {
    starter: ["generator_basic", "whatsapp_community", "guide", "checklist", "cutoffs", "updates"],
    pro: ["generator_advanced", "whatsapp_community", "guide", "checklist", "cutoffs", "updates", "pro_group_support", "pro_community", "one_on_one_counseling", "step_by_step_guidance", "pro_curated_list", "pro_doc_checklist", "guided_form_filling"],
    accelerator: ["generator_advanced", "whatsapp_community", "guide", "checklist", "cutoffs", "updates", "priority_support", "accelerator_community", "one_on_one_counseling", "step_by_step_guidance", "pro_curated_list", "accelerator_curated_list", "one_on_one_form_filling", "spot_round_guidance"]
};

export default function UserDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [isCounselingDialogOpen, setIsCounselingDialogOpen] = useState(false);

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            const detailsUrl = `${baseApiUrl}/apiv1/users/me/plan-status`;
            try {
                const response = await axios.get(detailsUrl, { withCredentials: true });
                console.log("UserDashboard: Data received from /me/plan-status API:", JSON.stringify(response.data, null, 2));

                if (response.data && response.data.success) {
                    setDashboardData(response.data);
                } else {
                    throw new Error(response.data.message || "Failed to fetch dashboard data.");
                }
            } catch (err) {
                let errorMsg = "Could not load dashboard data.";
                if (err.response?.status === 401 || err.response?.status === 403) {
                    errorMsg = "Authentication failed. Please log in again.";
                    toast.error(errorMsg);
                    setTimeout(() => router.push('/auth/login'), 1500);
                } else {
                    errorMsg = err.response?.data?.message || err.message || errorMsg;
                    toast.error(errorMsg);
                }
                setError(errorMsg);
                setDashboardData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [baseApiUrl, router]);

    if (isLoading) { return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-gray-500" /></div> ); }
    if (error && !dashboardData) { return ( <div className="container mx-auto p-4 md:p-6 lg:p-8"><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Dashboard</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> ); }

    const { user, plan, usage } = dashboardData || {};
    const currentPlanId = plan?.id || 'starter';
    const availableFeatureKeys = planFeatures[currentPlanId] || planFeatures.starter;
    const formatLimit = (limit) => (limit === Infinity ? 'Unlimited' : limit);
    const generatorUsage = usage?.collegeListGenerationsUsed ?? 0;
    const generatorLimit = usage?.collegeListGenerationLimit ?? 0;
    const generatorProgress = generatorLimit > 0 && generatorLimit !== Infinity ? ((generatorUsage / generatorLimit) * 100) : (generatorLimit === Infinity ? 100 : 0);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            <Toaster position="top-right" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}!</h1>
            {error && dashboardData && ( <Alert variant="warning" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Notice</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Column 1: Profile & Plan */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card & Plan Card ... (content remains the same) ... */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Your Profile</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700"><User className="h-4 w-4" /><span>{user?.name || 'N/A'}</span></div>
                            <div className="flex items-center gap-2 text-gray-700"><Mail className="h-4 w-4" /><span>{user?.email || 'N/A'}</span></div>
                            {user?.phoneNumber && (<div className="flex items-center gap-2 text-gray-700"><Phone className="h-4 w-4" /><span>{user.phoneNumber}</span></div>)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Current Plan</CardTitle><CardDescription>Your active subscription details.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center"><span className="font-medium text-gray-700">Plan Name:</span><Badge variant={plan?.id === 'starter' ? "secondary" : "default"}>{plan?.name || 'Starter'}</Badge></div>
                            <div className="space-y-2"><div className="flex justify-between items-baseline text-sm font-medium text-gray-700"><span>Generator Usage:</span><span>{generatorUsage} / {formatLimit(generatorLimit)}</span></div><Progress value={generatorProgress} className="h-2" aria-label={`${generatorProgress}% generator usage`} />{generatorLimit === Infinity && (<p className="text-xs text-green-600 text-right">Unlimited Usage</p>)}</div>
                            <div className="text-xs text-gray-500">Status: <span className={cn( plan?.status === 'Completed' ? 'text-green-600' : plan?.status === 'Pending' ? 'text-yellow-600' : plan?.status === 'Failed' ? 'text-red-600' : '' )}>{plan?.status || (plan?.id === 'starter' ? 'Active' : 'N/A')}</span>{plan?.activationDate && ` | Activated: ${new Date(plan.activationDate).toLocaleDateString()}`}</div>
                        </CardContent>
                        <CardFooter><Button variant="outline" size="sm" onClick={() => router.push('/pricing')}>View Plans / Upgrade</Button></CardFooter>
                    </Card>
                </div>

                {/* Column 2: Features */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle>Your Features & Resources</CardTitle><CardDescription>Access the tools and guides included in your plan.</CardDescription></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {availableFeatureKeys.map((featureKey) => {
                                const feature = featureDetails[featureKey];
                                if (!feature) { console.warn(`Feature details not found for key: ${featureKey}`); return null; }
                                const Icon = feature.icon;
                                const isExternal = feature.type === 'external';
                                const isInfoOnly = feature.type === 'info';
                                const isDialogType = feature.type === 'dialog';
                                const isGeneratorFeature = featureKey.startsWith('generator_');
                                let limit = isGeneratorFeature ? generatorLimit : Infinity;
                                let used = isGeneratorFeature ? generatorUsage : 0;
                                const isDisabled = isGeneratorFeature && limit !== Infinity && used >= limit;
                                const buttonContent = isGeneratorFeature ? 'Go to Generator' : isExternal ? 'Access Link' : 'View Resource';

                                return (
                                    <div key={featureKey} className={cn("p-4 border rounded-lg bg-white flex flex-col justify-between", {"bg-gray-100 opacity-70": isDisabled, "hover:shadow-md transition-shadow duration-200": !isDisabled })}>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon className={cn("h-6 w-6", isDisabled ? "text-gray-400" : "text-gray-700")} />
                                                <h3 className={cn("font-semibold text-base", isDisabled ? "text-gray-500" : "text-gray-800")}>{feature.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                                            {isGeneratorFeature && (<p className="text-xs text-gray-500 mb-3">Usage: {used} / {formatLimit(limit)}</p>)}
                                        </div>
                                        {/* Conditional rendering for button or DialogTrigger */}
                                        {!isInfoOnly && !isDialogType && ( // Regular button for 'link' or 'external'
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => {
                                                    if (isDisabled) { toast.error("Usage limit reached for this feature."); return; }
                                                    if (isExternal) { if (feature.link && feature.link !== '#') { window.open(feature.link, '_blank', 'noopener,noreferrer'); } else { toast.error("Link not available yet."); } }
                                                    else if (feature.link) { router.push(feature.link); }
                                                    else { toast.error("Resource not available yet."); }
                                                }}
                                                className={cn("w-full mt-auto", isDisabled ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white")}
                                                disabled={isDisabled || !feature.link || feature.link === '#'}
                                            >
                                                {buttonContent}
                                                {isExternal && !isDisabled && feature.link && feature.link !== '#' && <ExternalLink className="ml-2 h-3 w-3" />}
                                                {isDisabled && <Lock className="ml-2 h-3 w-3" />}
                                            </Button>
                                        )}
                                        {/* --- FIX: Use a regular Button to trigger the Dialog state --- */}
                                        {isDialogType && featureKey === 'one_on_one_counseling' && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full mt-auto bg-black hover:bg-gray-800 text-white"
                                                onClick={() => setIsCounselingDialogOpen(true)} // Manually set state
                                            >
                                                Book Session / Learn More
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Counseling Booking Dialog (remains at the bottom, controlled by state) */}
            <Dialog open={isCounselingDialogOpen} onOpenChange={setIsCounselingDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">Book 1-on-1 Counselling</DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600">
                            Our In-Depth 1-on-1 Counselling sessions are designed to provide you with personalized strategies for MHT-CET.
                            This feature is available for Pro and Accelerator plan users.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <p className="text-sm text-gray-700"><strong>What to expect:</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                            <li>Personalized profile review.</li>
                            <li>Detailed preference list strategy.</li>
                            <li>Doubt clearing and query resolution.</li>
                            <li>Guidance on form filling and choice locking.</li>
                        </ul>
                        <p className="text-sm text-gray-700 pt-2"><strong>How to book:</strong></p>
                        <p className="text-sm text-gray-600">
                            Please contact us via WhatsApp to schedule your session. Our team will coordinate with you to find a suitable time.
                        </p>
                        <Button variant="outline" className="w-full mt-2" onClick={() => window.open('https://wa.me/919209143384?text=Hi%2C%20I%20would%20like%20to%20book%20a%201-on-1%20counselling%20session.', '_blank')}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Contact on WhatsApp
                        </Button>
                        <p className="text-xs text-center text-gray-500 pt-2">
                            Links for booking specific slots will be enabled from May 15th. Keep checking your dashboard.
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
