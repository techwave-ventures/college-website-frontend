// File: app/blogs/MHTCET/components/MhtCetSidebar.jsx

"use client"; // Keep as client component for usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import hook to get current path

// Define the expected structure for a link prop
// interface SidebarLink {
//   href: string;
//   label: string;
// }

// The component now accepts 'links' as a prop
export default function MhtCetSidebar({ links = [] }) { // Default to empty array
  const pathname = usePathname(); // Get the current URL path

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8 lg:mr-12">
      <div className="sticky top-24 bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-300">
          MHTCET Updates
        </h3>
        <nav className="space-y-2">
          {/* Map over the links passed via props */}
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href} // Use href as key assuming it's unique
                href={link.href}
                className={`block px-4 py-2 rounded-md text-base transition-colors duration-150 ease-in-out
                  ${isActive
                    ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          {links.length === 0 && (
             <p className="text-sm text-gray-500">No topics found.</p>
          )}
        </nav>
      </div>
    </aside>
  );
}