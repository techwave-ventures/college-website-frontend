// Suggested file path: app/contact/page.jsx (or your chosen path)

"use client"; // Needed for form state if using a form

import React, { useState } from 'react';
import Navbar from "../_components/Navbar"; // Adjust path as needed
import Footer from "../_components/Footer"; // Adjust path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'; // Icons
import toast, { Toaster } from 'react-hot-toast'; // For form submission feedback

export default function ContactUsPage() {

    // Basic state for a contact form (optional)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Placeholder submit handler - replace with your actual API call
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Form Data Submitted:", formData);
        // --- Replace with your API call logic ---
        // Example:
        // try {
        //   await axios.post('/api/contact', formData);
        //   toast.success("Message sent successfully!");
        //   setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        // } catch (error) {
        //   toast.error("Failed to send message. Please try again.");
        //   console.error("Contact form error:", error);
        // } finally {
        //   setIsSubmitting(false);
        // }
        // --- End Replace ---

        // Placeholder behavior:
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        toast.success("Message sent successfully! (Placeholder)");
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        setIsSubmitting(false);
    };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" /> {/* Add Toaster for feedback */}

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg border border-gray-200">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-300 pb-4 text-center">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

            {/* Contact Information Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed">
                Have questions about our services, your account, or need assistance? Reach out to us using the details below, or fill out the contact form.
              </p>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <a href="mailto:techwaveventures@gmail.com" className="text-indigo-600 hover:text-indigo-800 hover:underline break-all">
                      techwaveventures@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <a href="tel:+919209143384" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                      +91 92091 43384
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      Campus Sathi <br />
                      TechWave Ventures Private Limited<br />
                      Pune, Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Form Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">Your Name</Label>
                  <Input
                    id="name" type="text" name="name"
                    value={formData.name} onChange={handleInputChange}
                    placeholder="John Doe" required disabled={isSubmitting}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">Your Email</Label>
                  <Input
                    id="email" type="email" name="email"
                    value={formData.email} onChange={handleInputChange}
                    placeholder="you@example.com" required disabled={isSubmitting}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-medium text-gray-700">Subject</Label>
                  <Input
                    id="subject" type="text" name="subject"
                    value={formData.subject} onChange={handleInputChange}
                    placeholder="e.g., Question about Basic Plan" required disabled={isSubmitting}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium text-gray-700">Message</Label>
                  <Textarea
                    id="message" name="message" rows={5}
                    value={formData.message} onChange={handleInputChange}
                    placeholder="Enter your query or feedback here..." required disabled={isSubmitting}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                       <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending... </>
                    ) : (
                       <> Send Message <Send className="ml-2 h-4 w-4" /> </>
                    )}
                  </Button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
