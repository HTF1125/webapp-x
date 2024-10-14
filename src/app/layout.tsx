
import dynamic from "next/dynamic";
import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/ErrorBoundary";

const Navbar = dynamic(() => import("@/components/navbar/Navbar"), {
  ssr: false,
  loading: () => <div>Loading navbar...</div>,
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Investment-X",
  description: "Advanced investment research and strategy platform",
  openGraph: {
    title: "Investment-X",
    description: "Advanced investment research and strategy platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment-X",
    description: "Advanced investment research and strategy platform",
  },
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
      className={`${roboto.variable} font-sans`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#main-content" className="sr-only focus:not-sr-only">
              Skip to main content
            </a>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main id="main-content" className="flex-grow">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer className="bg-gray-100 dark:bg-gray-800 py-4">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    © 2024 Investment-X. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
