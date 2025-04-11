"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-md px-6 py-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <Button onClick={() => router.push("/auth/logout")} className="bg-red-600 text-white">
          Logout
        </Button>
      </nav>

      {/* User Content */}
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-semibold mb-6">Welcome, [User Name]</h2>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold">Your Progress</h3>
            <p className="text-gray-700 mt-2">Completed 6/10 counseling sessions</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold">Upcoming Sessions</h3>
            <p className="text-gray-700 mt-2">Next session on 5th March, 3 PM</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Quick Actions</h3>
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => router.push("/counseling/sessions")} className="bg-black text-white">
              View Sessions
            </Button>
            <Button onClick={() => router.push("/counseling/enroll")} className="bg-gray-800 text-white">
              Enroll in New Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
