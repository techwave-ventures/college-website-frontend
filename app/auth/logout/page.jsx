"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear authentication tokens or session storage
    localStorage.removeItem("authToken"); // Example: Remove auth token
    sessionStorage.clear(); // Clear session data if needed

    // Redirect to login page after logout
    router.push("/auth/login");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold text-black">Logging out...</h2>
    </div>
  );
}
