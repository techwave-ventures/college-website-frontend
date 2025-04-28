import React from 'react';

// SVG Icons (can be moved to separate components if preferred)
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
  </svg>
);


export default function Footer() {
  return (
    // Changed px-4 to px-8 for more horizontal padding
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Important Pages Section */}
        <nav className="space-y-2">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Imp Pages</h6>
          {/* Add relevant links here based on your site structure */}
          <a href="#" className="block hover:text-white hover:underline transition duration-300">Home</a>
          <a href="#" className="block hover:text-white hover:underline transition duration-300">College Predictor</a>
          <a href="#" className="block hover:text-white hover:underline transition duration-300">Exams</a>
          <a href="#" className="block hover:text-white hover:underline transition duration-300">Colleges</a>
        </nav>

        {/* Company Section */}
        <nav className="space-y-2">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Company</h6>
          {/* Links from the image */}
          <a href="#" className="block hover:text-white hover:underline transition duration-300">Home</a>
          <a href="#" className="block hover:text-white hover:underline transition duration-300">About</a>
          <a href="#" className="block hover:text-white hover:underline transition duration-300">Contact Us</a>
          <a href="/privacy-policy" className="block hover:text-white hover:underline transition duration-300">Privacy Policy</a>
          <a href="/return-refund-policy" className="block hover:text-white hover:underline transition duration-300">Return & Refund Policy</a>
          <a href="/terms-of-service" className="block hover:text-white hover:underline transition duration-300">Terms of Service</a>
        </nav>

        {/* Follow Us Section */}
        <nav className="space-y-2 md:text-left text-center">
          <h6 className="font-semibold text-lg mb-3 text-white uppercase tracking-wider">Follow Us</h6>
          <div className="flex space-x-4 justify-center md:justify-start">
            {/* Social Media Icons */}
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <YouTubeIcon />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              <FacebookIcon />
            </a>
            {/* Add other icons like Instagram, LinkedIn if needed */}
          </div>
           {/* Optional: Add contact info here if desired */}
           {/* <div className="mt-4 text-sm">
             <p>Email: contact@campussathi.com</p> {/* Updated company name */}
             {/* <p>Phone: +91 12345 67890</p>
           </div> */}
        </nav>

      </div>

      {/* Bottom Bar - Updated with <br /> tag */}
      <div className="text-center mt-10 pt-6 border-t border-gray-700 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Campus Sathi <br /> {/* Line break added here */}
        Designed & Developed by Techwave ventures. {/* Updated developer name */}
      </div>
    </footer>
  );
}
