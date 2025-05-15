// app/_components/CollegeDetailSidebar.jsx

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To potentially highlight active section (more advanced)
import { cn } from "@/lib/utils"; // Assuming you have clsx/tailwind-merge

export default function CollegeDetailSidebar({ sections }) {
  const pathname = usePathname(); // For active section highlighting

  if (!sections || sections.length === 0) {
    return null; // Don't render sidebar if no sections
  }

  return (
    <aside className="w-full md:w-60 lg:w-64 flex-shrink-0 mb-8 md:mb-0 md:mr-8 lg:mr-12">
      <div className="sticky top-24 bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-300">
          On This Page
        </h3>
        <nav className="space-y-1.5">
          {sections.map((section) => {
            // Basic active check (can be improved with intersection observer for scroll spy)
            const isActive = typeof window !== 'undefined' && window.location.hash === `#${section.id}`;
            return (
              <Link
                key={section.id}
                href={`#${section.id}`} // Link to the fragment identifier
                className={cn(
                  "block px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ease-in-out",
                  isActive
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  :
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => { /* Optional: handle smooth scroll or update active state */ }}
              >
                {section.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}