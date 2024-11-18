import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Navbar from "@/components/navbar/Navbar";

const font = Roboto_Condensed({
  weight: ["400", "500", "700"],
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
    <html lang="en" suppressHydrationWarning className={`${font.className} dark`}>
      <body className="bg-black text-white">
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
