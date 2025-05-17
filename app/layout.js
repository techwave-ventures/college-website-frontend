import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Default title if no specific page title is set
  // title: 'Campus Sathi - Your MHT-CET Admission Partner',
  // Title template: %s will be replaced by child page titles
  title: {
    default: 'Campus Sathi',
    template: '%s | Campus Sathi',
  },
  description: 'Campus Sathi helps MHT-CET aspirants navigate the engineering and pharmacy admission process in Maharashtra with tools like a college preference list generator, cutoff information, and expert guidance.',
  // Add other default metadata like openGraph images, icons, etc.
  icons: {
    icon: '/favicon.ico', // Ensure favicon.ico is in app/ or public/
    apple: '/apple-icon.png', // Ensure apple-icon.png is in app/ or public/
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
