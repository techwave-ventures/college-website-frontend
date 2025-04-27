"use client";

import React from 'react';
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // Assuming shadcn/ui Card
import { Check } from "lucide-react"; // Using lucide-react for icons

// Define plan data based on the image and with catchy points/discounts
const pricingPlans = [
  {
    name: "Starter Pack",
    originalPrice: "₹ 299", // No original price for free
    price: "₹0",
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
    bgColor: "bg-white", // Standard background
    textColor: "text-gray-900",
    buttonBgColor: "bg-black hover:bg-gray-800", // Black button
    buttonTextColor: "text-white",
    buttonVariant: "default", // Use default for black button
    badge: null,
    checkColor: "text-green-600", // Standard check color
  },
  {
    name: "Guidance Pro",
    originalPrice: "₹ 999", // Hefty discount example
    price: "₹799",
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
    bgColor: "bg-gray-800", // Highlight color (dark grey)
    textColor: "text-white",
    buttonBgColor: "bg-white hover:bg-gray-200", // White button on dark bg
    buttonTextColor: "text-gray-800", // Dark text for white button
    buttonVariant: "secondary", // Keep as secondary or adjust if needed
    badge: "Most Popular", // Badge for highlighting
    badgeStyle: "bg-white text-black", // Badge style for dark bg
    checkColor: "text-green-400", // Lighter green check for dark bg
  },
  {
    name: "Admission Accelerator",
    originalPrice: "₹ 7999", // Hefty discount example
    price: "₹3999",
    priceSuffix: "/ One-Time",
    description: "Comprehensive support for guaranteed results.",
    features: [
      "All Guidance Pro Features",
      "Priority WhatsApp Support (Fast Response)",
      "In-Depth 1-on-1 Expert Counselling",
      "Expert-Curated College Preference List",
      "Dedicated 1-on-1 Form Filling Support",
      "Donation Admission Guidance", // Rephrased
      "Unlimited College List Generator Access",
    ],
    buttonText: "Accelerate Admission",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    buttonBgColor: "bg-black hover:bg-gray-800", // Black button
    buttonTextColor: "text-white",
    buttonVariant: "default", // Use default for black button
    badge: null,
    checkColor: "text-green-600", // Standard check color
  },
];

export default function Pricing() {
  return (
    // Adjusted background gradient for grey theme
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
              key={index}
              // Updated border color for highlighted plan
              className={`flex flex-col rounded-xl shadow-lg overflow-hidden ${plan.bgColor} ${plan.textColor} ${plan.badge ? 'border-2 border-gray-600 relative' : 'border'}`}
            >
              {plan.badge && (
                // Updated badge style
                <div className={`absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg ${plan.badgeStyle}`}>
                  {plan.badge}
                </div>
              )}

              {/* Reduced bottom padding (pb-2) */}
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className={`text-2xl font-semibold ${plan.badge ? 'text-white' : 'text-gray-800'}`}>{plan.name}</CardTitle>
                <CardDescription className={`mt-2 text-sm ${plan.badge ? 'text-gray-300' : 'text-gray-600'}`}> {/* Adjusted description color */}
                  {plan.description}
                </CardDescription>
              </CardHeader>

              {/* Reduced top padding (pt-2) */}
              <CardContent className="flex-grow px-4 pt-2 pb-4 space-y-3">
                <div className="mb-4"> {/* Reduced margin-bottom */}
                  {plan.originalPrice && (
                     // Adjusted strikethrough text color
                     <p className={`text-xs line-through ${plan.badge ? 'text-gray-400' : 'text-gray-500'}`}>
                       {plan.originalPrice}
                     </p>
                  )}
                  <p className={`text-3xl font-bold ${plan.badge ? 'text-white' : 'text-gray-900'}`}> {/* Slightly smaller price */}
                    {plan.price}
                     {/* Adjusted suffix color */}
                    <span className={`text-base font-normal ml-1 ${plan.badge ? 'text-gray-300' : 'text-gray-500'}`}>
                      {plan.priceSuffix}
                    </span>
                  </p>
                </div>

                {/* Updated features text color */}
                <ul className={`text-left space-y-2 ${plan.badge ? 'text-gray-200' : 'text-gray-700'}`}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {/* Updated check icon color */}
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.checkColor}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {/* Reduced internal padding from p-6 to p-4 */}
              <CardFooter className="p-4 mt-auto">
                <Button
                  size="lg"
                  variant={plan.buttonVariant}
                  // Updated button background and text colors
                  className={`w-full rounded-lg ${plan.buttonBgColor} ${plan.buttonTextColor}`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
