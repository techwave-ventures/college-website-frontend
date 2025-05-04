// File: app/payment-status/page.jsx

"use client"; // Required for hooks like useSearchParams

import { useEffect, useState, Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

// Define status messages and styles (keep this the same)
const statusInfo = {
  SUCCESS: {
    title: "Payment Successful!",
    description: "Your registration is complete. Thank you!",
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  FAILURE: {
    title: "Payment Failed",
    description: "There was an issue processing your payment. Please try again or contact support.",
    icon: <XCircle className="h-16 w-16 text-red-500" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  PENDING: {
    title: "Payment Processing",
    description: "Your payment is being processed. We will notify you once confirmed. Please check back later.",
    icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  UNKNOWN: {
    title: "Payment Status Unknown",
    description: "We could not determine the status of your payment. Please check your email or contact support.",
    icon: <AlertTriangle className="h-16 w-16 text-gray-500" />,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
    LOADING: { // Used by PaymentStatusContent initial state
    title: "Checking Payment Status...",
    description: "Please wait while we verify your payment.",
    icon: <Loader2 className="h-16 w-16 animate-spin text-blue-500" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  }
};

// --- Component using useSearchParams ---
// (Keep this component as it is)
function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('LOADING'); // Start with loading
    const [details, setDetails] = useState({});

    useEffect(() => {
        console.log("Payment Status Page: Reading search params...");
        const statusCode = searchParams.get('code');
        const merchantTxnId = searchParams.get('merchantTransactionId') || searchParams.get('txnid');
        const providerReferenceId = searchParams.get('providerReferenceId') || searchParams.get('transactionId');

        console.log("Query Params:", { statusCode, merchantTxnId, providerReferenceId });

        let determinedStatus = 'UNKNOWN';

        if (statusCode) {
            if (statusCode === 'PAYMENT_SUCCESS') {
                determinedStatus = 'SUCCESS';
            } else if (statusCode === 'PAYMENT_ERROR' || statusCode === 'PAYMENT_FAILURE' || statusCode === 'TRANSACTION_FAILURE') {
                determinedStatus = 'FAILURE';
            } else if (statusCode === 'PAYMENT_PENDING' || statusCode === 'TRANSACTION_PENDING') {
                determinedStatus = 'PENDING';
            }
        } else {
             console.log("No 'code' query parameter found, status remains UNKNOWN for now.");
        }

        setStatus(determinedStatus);
        setDetails({ merchantTxnId, providerReferenceId });

    }, [searchParams]);

    const currentStatus = statusInfo[status] || statusInfo.UNKNOWN;

    return (
        <Card className={`w-full max-w-lg mx-auto shadow-md border ${currentStatus.borderColor} ${currentStatus.bgColor}`}>
            <CardHeader className="text-center items-center flex flex-col pt-8">
                {currentStatus.icon}
                <CardTitle className="text-2xl font-semibold mt-4">{currentStatus.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                    {currentStatus.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500 space-y-1 px-6 pb-6">
                {details.merchantTxnId && (
                    <p>Your Transaction ID: {details.merchantTxnId}</p>
                )}
                {details.providerReferenceId && (
                    <p>Payment Gateway Ref: {details.providerReferenceId}</p>
                )}
                {status === 'FAILURE' && (
                     <p className="pt-2">If amount was debited, it usually gets refunded within 5-7 working days.</p>
                )}
                 {status === 'PENDING' && (
                     <p className="pt-2">You can close this page. We will update you via email/SMS.</p>
                )}
            </CardContent>
            <CardContent className="flex justify-center pb-8 px-6">
                 <Button asChild variant="outline">
                     <Link href="/">Go to Homepage</Link>
                 </Button>
                 {/* Optional Try Again Button */}
            </CardContent>
        </Card>
    );
}

// --- Simple Fallback Component ---
// This component does NOT use useSearchParams
function LoadingFallback() {
    const loadingStatus = statusInfo.LOADING; // Get loading style info
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
                 {/* Optionally add a simple button or just keep it minimal */}
                 {/* <Button variant="outline" disabled>Loading...</Button> */}
             </CardContent>
        </Card>
    );
}


// --- Main page component wraps the content in Suspense ---
export default function PaymentStatusPage() {
    return (
        // Add Navbar/Footer here if needed for layout
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
             {/* Wrap the component using the hook in Suspense */}
             {/* Use the simple LoadingFallback for the fallback prop */}
            <Suspense fallback={<LoadingFallback />}>
                <PaymentStatusContent />
            </Suspense>
        </div>
    );
}