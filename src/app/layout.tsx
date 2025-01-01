import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/components/Providers";
import { NextUIProvider } from "@nextui-org/react";

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
      <body className="bg-black text-white min-h-screen flex flex-col">
        <NextUIProvider>
          <ErrorBoundary>
            <Providers>
              <header className="fixed top-0 left-0 w-full shadow-lg bg-gray-800 z-50">
                <Navbar />
              </header>
              <main className="flex-grow w-full max-w-[1980px] mx-auto px-6 sm:px-8 lg:px-10 py-24">
                {children}
              </main>
            </Providers>
            <footer className="w-full h-5vh text-sm text-gray-400 text-left mt-auto">
              <div>
                © {new Date().getFullYear()} Investment-X. All rights reserved.
              </div>
            </footer>
          </ErrorBoundary>
        </NextUIProvider>

        <Analytics />
      </body>
    </html>
  );
}
