import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Navbar from "@/components/navbar/Navbar";

const font = Roboto_Condensed({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investment-X",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${font.className} dark`}
    >
      <body className="bg-gray-900 text-white">
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="w-full shadow-lg bg-gray-800">
              <Navbar />
            </header>

            {/* Main Content */}
            <main className="w-full flex-grow max-w-[1980px] mx-auto px-6 sm:px-8 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 py-4 text-sm text-gray-400 text-center">
              © {new Date().getFullYear()} Investment-X. All rights reserved.
            </footer>
          </div>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
