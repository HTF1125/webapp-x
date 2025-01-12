import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Providers from "@/components/Providers";
import Sidebar from "@/components/sidebar/comp";

// Load Google Font
const font = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
});

// Metadata for the application
export const metadata: Metadata = {
  title: "Investment-X",
  description: "Your go-to platform for investment insights and management",
};

// Main layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body className="overflow-hidden">
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NextUIProvider>
            <Providers>
              <div className="flex h-screen w-screen">
                <Sidebar />
                <div className="flex-1 overflow-hidden">
                  <main className="h-full w-full overflow-y-auto bg-background text-foreground p-4">
                    {children}
                  </main>
                </div>
              </div>
            </Providers>
          </NextUIProvider>
        </NextThemesProvider>
        <Analytics />
      </body>
    </html>
  );
}
