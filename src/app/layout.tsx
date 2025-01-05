import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { MantineProvider } from "@mantine/core";
import { NextUIProvider } from "@nextui-org/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/components/Providers";

const font = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap"
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
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <MantineProvider>
          <NextUIProvider>
            <ErrorBoundary>
              <Providers>
                <header className="sticky top-0 left-0 w-full bg-gray-800 shadow-lg z-50">
                  <Navbar />
                </header>
                <main className="flex-grow w-full mx-auto bg-black px-6 sm:px-8 lg:px-10 py-24">
                  {children}
                </main>
              </Providers>
              <footer className="w-full text-sm text-gray-400 text-center mt-auto py-4 border-t border-gray-700">
                <div>
                  © {new Date().getFullYear()} Investment-X. All rights reserved.
                </div>
              </footer>
            </ErrorBoundary>
          </NextUIProvider>
        </MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
