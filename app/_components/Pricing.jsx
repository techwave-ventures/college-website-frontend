import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa"; // Importing Tick Icon

export default function Pricing() {
  return (
    <section className="text-center p-10">
      <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
      <p className="text-gray-600 mb-8">Choose a plan that best fits your college admission needs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pricing Card Component */}
        {[
          {
            name: "Basic Plan",
            price: "Try for Free",
            description: "Get started with essential guidance.",
            features: [
              "College List Generator",
              "Entrance Exam Information",
              "Basic Admission Tips",
              "Access to Free Resources",
            ],
            buttonText: "Get Started Free",
          },
          {
            name: "Standard Plan",
            price: "₹999",
            description: "Expert advice to guide your admission journey.",
            features: [
              "Personalized College Shortlist",
              "30-Minute Counseling Session",
              "Exam & Application Guidance",
              "Scholarship & Loan Assistance",
              "Career Counseling",
            ],
            buttonText: "Get Standard Plan",
          },
          {
            name: "Premium Plan",
            price: "₹4999",
            description: "Complete end-to-end admission support.",
            features: [
              "Unlimited College Shortlisting",
              "Multiple Counseling Sessions",
              "Full Admission Strategy Planning",
              "Guidance on College Selection & Fees",
              "Scholarship & Financial Aid Support",
              "Priority Support Until Admission",
            ],
            buttonText: "Get Premium Plan",
          },
        ].map((plan, index) => (
          <div
            key={index}
            className="bg-gray-100 p-8 rounded-xl shadow-md flex flex-col justify-between h-full"
          >
            {/* Plan Header */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold text-black mb-1">{plan.price}</p>
              <p className="text-gray-600 mb-4">{plan.description}</p>
            </div>

            {/* Features List */}
            <ul className="text-gray-600 text-left space-y-2 mb-6 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" /> {feature}
                </li>
              ))}
            </ul>

            {/* Call to Action */}
            <Button className="bg-black text-white w-full rounded-full">
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
