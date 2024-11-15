import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/navbar/Navbar";

const inter = Inter({
  weight: ["400", "600", "700"],
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
    <html lang="en" suppressHydrationWarning className={`${inter.className} dark`}>
      <body className="bg-gray-900 text-gray-100">
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="w-full flex-grow max-w-[1800px] mx-auto">{children}</main>
          </div>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
