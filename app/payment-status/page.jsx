// File: app/payment-status/page.jsx

"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../_components/Navbar"; // Adjust path as needed
import Footer from "../_components/Footer"; // Adjust path as needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2, HelpCircle } from 'lucide-react'; // Added HelpCircle

// Define status messages and styles
const statusInfo = {
  SUCCESS: {
    title: "Payment Successful!",
    description: "Your plan has been activated. Thank you!", // Updated description
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  FAILURE: {
    title: "Payment Failed or Verification Issue", // Updated title
    description: "There was an issue processing or verifying your payment. If amount was debited, please contact support.", // Updated description
    icon: <XCircle className="h-16 w-16 text-red-500" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  CANCELLED: { // Added status for user cancellation
    title: "Payment Cancelled",
    description: "The payment process was cancelled. You can try again from the pricing page.",
    icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  UNKNOWN: {
    title: "Payment Status Unknown",
    description: "We could not determine the final status of your payment. Please check your dashboard or contact support.", // Updated description
    icon: <HelpCircle className="h-16 w-16 text-gray-500" />, // Changed icon
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
    LOADING: { // Used by LoadingFallback
    title: "Loading Status...",
    description: "Please wait.",
    icon: <Loader2 className="h-16 w-16 animate-spin text-blue-500" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  }
};

// --- Component using useSearchParams ---
function PaymentStatusContent() {
    const searchParams = useSearchParams();
    // Default to UNKNOWN, let useEffect determine status from params
    const [status, setStatus] = useState('UNKNOWN');
    const [details, setDetails] = useState({}); // Keep details if needed (e.g., txn ID if passed)

    useEffect(() => {
        console.log("Payment Status Page: Reading search params...");
        // Expecting simple status params like 'status=success', 'status=failure', 'status=cancelled'
        // These should be set by the redirect *after* backend verification in the Razorpay handler
        const statusParam = searchParams.get('status');
        const merchantTxnId = searchParams.get('merchantTransactionId') || searchParams.get('txnid'); // May still be useful for reference
        const orderId = searchParams.get('order_id'); // May be passed from handler

        console.log("Query Params:", { statusParam, merchantTxnId, orderId });

        let determinedStatus = 'UNKNOWN'; // Default

        if (statusParam) {
            const lowerStatus = statusParam.toLowerCase();
            if (lowerStatus === 'success' || lowerStatus === 'verified_success') {
                determinedStatus = 'SUCCESS';
            } else if (lowerStatus === 'failure' || lowerStatus === 'verified_failure') {
                determinedStatus = 'FAILURE';
            } else if (lowerStatus === 'cancelled') {
                determinedStatus = 'CANCELLED';
            }
            // Add more specific statuses if needed
        } else {
             console.log("No 'status' query parameter found. Displaying UNKNOWN.");
        }

        setStatus(determinedStatus);
        setDetails({ merchantTxnId, orderId }); // Store any relevant IDs passed

    }, [searchParams]);

    const currentStatus = statusInfo[status] || statusInfo.UNKNOWN;

    return (
        <Card className={`w-full max-w-lg mx-auto shadow-md border ${currentStatus.borderColor} ${currentStatus.bgColor}`}>
            <CardHeader className="text-center items-center flex flex-col pt-8">
                {currentStatus.icon}
                <CardTitle className="text-2xl font-semibold mt-4">{currentStatus.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-600 px-4"> {/* Added padding */}
                    {currentStatus.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500 space-y-1 px-6 pb-6">
                {/* Display transaction details if available */}
                {details.merchantTxnId && (
                    <p>Your Ref ID: {details.merchantTxnId}</p>
                )}
                {details.orderId && (
                    <p>Order ID: {details.orderId}</p>
                )}
                 {status === 'FAILURE' && (
                     <p className="pt-2">Please check your payment method or <Link href="/contact" className="text-indigo-600 hover:underline">contact support</Link>.</p>
                 )}
                 {status === 'CANCELLED' && (
                     <p className="pt-2">You can <Link href="/pricing" className="text-indigo-600 hover:underline">choose a plan</Link> again if you wish.</p>
                 )}
            </CardContent>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-8 px-6">
                 <Button asChild variant="default" className="w-full sm:w-auto">
                     <Link href="/user-dashboard">Go to Dashboard</Link> {/* Link to dashboard */}
                 </Button>
                 <Button asChild variant="outline" className="w-full sm:w-auto">
                     <Link href="/">Go to Homepage</Link>
                 </Button>
            </CardContent>
        </Card>
    );
}

// --- Simple Fallback Component ---
function LoadingFallback() {
    const loadingStatus = statusInfo.LOADING;
     return (
        <Card className={`w-full max-w-lg mx-auto shadow-md border ${loadingStatus.borderColor} ${loadingStatus.bgColor}`}>
            <CardHeader className="text-center items-center flex flex-col pt-8">
                {loadingStatus.icon}
                <CardTitle className="text-2xl font-semibold mt-4">{loadingStatus.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                    {loadingStatus.description}
                </CardDescription>
            </CardHeader>
             <CardContent className="flex justify-center pb-8 px-6 pt-6">
                 {/* Minimal content during loading */}
             </CardContent>
        </Card>
    );
}


// --- Main page component wraps the content in Suspense and adds Layout ---
export default function PaymentStatusPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                {/* Suspense is required because PaymentStatusContent uses useSearchParams */}
                <Suspense fallback={<LoadingFallback />}>
                    <PaymentStatusContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}