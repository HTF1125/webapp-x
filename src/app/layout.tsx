import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Providers from "@/components/Providers";
import { SidebarMenu } from "@/components/sidebar/SidebarMenuItem";
import { sectionItems } from "@/components/sidebar/sectionItems";
import { TopNavbar } from "@/components/topnavbar/TopNavBar";

// Load Google Font with proper subsets and display settings
const font = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "Investment-X",
  description: "Your go-to platform for investment insights and management",
};

// RootLayout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body className="overflow-hidden">
        {/* Theme and UI providers for the app */}
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NextUIProvider>
            <Providers>
              <div className="flex flex-col h-screen w-full mx-auto">
                {/* Top Navigation Bar */}
                <TopNavbar />

                {/* Main Layout with Sidebar and Content Area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar Menu */}
                  <SidebarMenu sections={sectionItems} />

                  {/* Centered Content Section */}
                  <div className="flex-1 flex items-center overflow-hidden transition-all duration-300 relative">
                    <main className="h-full w-full overflow-y-auto bg-background text-foreground p-4">
                      <section className="container mx-auto w-full max-w-7xl flex justify-center">
                        {children}
                      </section>
                    </main>
                  </div>
                </div>
              </div>
            </Providers>
          </NextUIProvider>
        </NextThemesProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
