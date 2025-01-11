import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Providers from "@/components/Providers";
import MenuNav from "@/components/menunav/MenuNav";

// Load Google Font
const font = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
});

// Metadata for the application
export const metadata: Metadata = {
  title: "Investment-X",
};

// Main layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body className="flex h-screen w-screen overflow-hidden">
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NextUIProvider>
            <Providers>
              <div className="flex w-screen h-screen">
                {/* Sidebar Navigation */}
                <div className="w-75px h-full bg-menu-nav border-r border-divider overflow-y-auto">
                  <MenuNav />
                </div>
                {/* Main Content Area */}
                <div className="w-full h-full flex flex-col overflow-hidden">
                  <main className="h-[calc(100%-80px)] p-4 overflow-y-auto bg-background text-foreground">
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
