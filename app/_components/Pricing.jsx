// components/Pricing.jsx (or your path)
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogTrigger, // We'll trigger manually via state
} from "@/components/ui/dialog";

// Import the RegistrationForm component
import RegistrationForm from './RegistrationForm'; // Adjust path if needed

// Define plan data with numeric amount (in paisa)
const pricingPlans = [
    {
        id: "starter", // Add a unique ID
        name: "Starter Pack",
        originalPrice: null,
        price: "₹0",
        amount: 0, // Amount in paisa
        priceSuffix: "/ Forever",
        description: "Begin your journey with essential tools.",
        features: [
        "Essential Counselling Process Guide",
        "Category-Specific Document Checklist",
        "Previous Year MHT-CET Cutoffs",
        "Latest MHT-CET Updates",
        "Basic College List Generator (5 Uses)",
        ],
        buttonText: "Start for Free",
        bgColor: "bg-white",
        textColor: "text-gray-900",
        buttonBgColor: "bg-black hover:bg-gray-800",
        buttonTextColor: "text-white",
        buttonVariant: "default",
        badge: null,
        checkColor: "text-green-600",
    },
    {
        id: "pro", // Add a unique ID
        name: "Guidance Pro",
        originalPrice: "₹ 999",
        price: "₹799",
        amount: 79900, // Amount in paisa (799 * 100)
        priceSuffix: "/ One-Time",
        description: "Personalized guidance to boost your chances.",
        features: [
        "All Starter Pack Features",
        "Dedicated Group Support (WhatsApp)",
        "Personalized 30-Min Expert Session",
        "Guided Group Form Filling Assistance",
        "Exclusive Community Access",
        "Advanced College List Generator (25 Uses)",
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
        id: "accelerator", // Add a unique ID
        name: "Admission Accelerator",
        originalPrice: "₹ 7999",
        price: "₹3999",
        amount: 399900, // Amount in paisa (3999 * 100)
        priceSuffix: "/ One-Time",
        description: "Comprehensive support for guaranteed results.",
        features: [
        "All Guidance Pro Features",
        "Priority WhatsApp Support (Fast Response)",
        "In-Depth 1-on-1 Expert Counselling",
        "Expert-Curated College Preference List",
        "Dedicated 1-on-1 Form Filling Support",
        "Donation Admission Guidance",
        "Unlimited College List Generator Access",
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
  // State to manage the selected plan and modal visibility
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle selecting a plan and opening the modal
  const handleSelectPlan = (plan) => {
    // For the free plan, maybe redirect directly or show a different message?
    // For now, we'll open the form even for free, but the form logic should handle amount=0
    // if (plan.amount === 0) {
    //   // Handle free plan signup differently if needed
    //   console.log("Free plan selected");
    //   // router.push('/signup?plan=free'); // Example
    //   return;
    // }
    setSelectedPlan(plan);
    setIsModalOpen(true);
    console.log("Selected Plan:", plan);
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
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.id} // Use unique ID for key
              className={`flex flex-col rounded-xl shadow-lg overflow-hidden ${plan.bgColor} ${plan.textColor} ${plan.badge ? 'border-2 border-gray-600 relative' : 'border'}`}
            >
              {plan.badge && (
                <div className={`absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg ${plan.badgeStyle}`}>
                  {plan.badge}
                </div>
              )}

              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className={`text-2xl font-semibold ${plan.badge ? 'text-white' : 'text-gray-800'}`}>{plan.name}</CardTitle>
                <CardDescription className={`mt-2 text-sm ${plan.badge ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.description}
                </CardDescription>
              </CardHeader>

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

              <CardFooter className="p-4 mt-auto">
                {/* --- Updated Button --- */}
                <Button
                  size="lg"
                  variant={plan.buttonVariant}
                  className={`w-full rounded-lg ${plan.buttonBgColor} ${plan.buttonTextColor}`}
                  onClick={() => handleSelectPlan(plan)} // Call handler on click
                >
                  {plan.buttonText}
                </Button>
                {/* --- End Updated Button --- */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* --- Registration Form Dialog --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"> {/* Adjust width/height */}
          <DialogHeader>
            <DialogTitle>Register for: {selectedPlan?.name || 'Guidance'}</DialogTitle>
            <DialogDescription>
              Complete your details below to proceed with the {selectedPlan?.name || 'selected'} plan.
              {selectedPlan?.amount > 0 && ` Amount: ₹${selectedPlan.amount / 100}`}
            </DialogDescription>
          </DialogHeader>
          {/* Render the form only if a plan is selected */}
          {selectedPlan && (
            <RegistrationForm
              plan={selectedPlan} // Pass the whole plan object
              onSuccess={() => setIsModalOpen(false)} // Optional: Close modal on success (needs implementation in form)
            />
          )}
           {/* You might want a close button inside the form or rely on the default Dialog close */}
        </DialogContent>
      </Dialog>
      {/* --- End Dialog --- */}

    </section>
  );
}
