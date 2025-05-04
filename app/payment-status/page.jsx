// app/payment-status/page.jsx
// Client component to display payment status feedback after returning from PhonePe.

"use client"; // Required for hooks like useSearchParams

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'; // Icons

// Define status messages and styles
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
   LOADING: {
    title: "Checking Payment Status...",
    description: "Please wait while we verify your payment.",
    icon: <Loader2 className="h-16 w-16 animate-spin text-blue-500" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  }
};

// Separate component to access searchParams because it needs Suspense
function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('LOADING'); // Start with loading
    const [details, setDetails] = useState({});

    useEffect(() => {
        console.log("Payment Status Page: Reading search params...");
        // PhonePe typically sends status in POST body to redirectUrl, but sometimes might add query params too.
        // We primarily rely on backend callback, but check query params for immediate feedback.
        // Common query params (names might vary, check PhonePe docs/callback):
        const statusCode = searchParams.get('code'); // e.g., PAYMENT_SUCCESS, PAYMENT_ERROR
        const merchantTxnId = searchParams.get('merchantTransactionId') || searchParams.get('txnid');
        const providerReferenceId = searchParams.get('providerReferenceId') || searchParams.get('transactionId'); // PhonePe's ID

        console.log("Query Params:", { statusCode, merchantTxnId, providerReferenceId });

        let determinedStatus = 'UNKNOWN'; // Default if no clear status code

        if (statusCode) {
            if (statusCode === 'PAYMENT_SUCCESS') {
                determinedStatus = 'SUCCESS';
            } else if (statusCode === 'PAYMENT_ERROR' || statusCode === 'PAYMENT_FAILURE' || statusCode === 'TRANSACTION_FAILURE') { // Add other failure codes if known
                determinedStatus = 'FAILURE';
            } else if (statusCode === 'PAYMENT_PENDING' || statusCode === 'TRANSACTION_PENDING') { // Add other pending codes
                determinedStatus = 'PENDING';
            }
        } else {
            // If no 'code', maybe check for other success/failure indicators if PhonePe uses them
            // For now, assume UNKNOWN if no 'code' param
             console.log("No 'code' query parameter found, status remains UNKNOWN for now.");
        }

        setStatus(determinedStatus);
        setDetails({ merchantTxnId, providerReferenceId });

        // Optional: Make an API call to your backend here to get the *verified* status
        // based on merchantTxnId, as the query params can be unreliable/spoofed.
        // const verifyStatus = async () => {
        //   try {
        //     const res = await axios.get(`/api/payment-status/${merchantTxnId}`, { withCredentials: true });
        //     // Update status based on verified backend response
        //     setStatus(res.data.verifiedStatus); // e.g., SUCCESS, FAILED
        //   } catch (err) {
        //     console.error("Error verifying payment status:", err);
        //     // Keep the status determined from query params or set to UNKNOWN
        //   }
        // }
        // if (merchantTxnId) verifyStatus();

    }, [searchParams]); // Re-run if searchParams change

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
                 {/* Optionally add a "Try Again" button for failures */}
                 {/* {status === 'FAILURE' && (
                     <Button asChild variant="default" className="ml-4">
                        <Link href="/register">Try Registration Again</Link>
                     </Button>
                 )} */}
            </CardContent>
        </Card>
    );
}


// Main page component wraps the content in Suspense
export default function PaymentStatusPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
             {/* Suspense is required to use useSearchParams */}
            <Suspense fallback={<PaymentStatusContent />}> {/* Show loading state initially */}
                <PaymentStatusContent />
            </Suspense>
        </div>
    );
}
