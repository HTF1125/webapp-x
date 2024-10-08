"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Menu } from "lucide-react";
import { checkApiHealth } from "./check";
import { ModeToggle } from "../mode-toggle";

const NavbarItem = ({ targetPath }: { targetPath: string }) => {
  const pathname = usePathname();

  const formatTargetPath = useCallback((path: string) => {
    return path
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const isActive = pathname === `/${targetPath.toLowerCase()}`;

  return (
    <Link
      href={`/${targetPath.toLowerCase()}`}
      className={`flex items-center px-4 py-2 text-base font-medium transition-all rounded-md
        ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
        }`}
    >
      {formatTargetPath(targetPath)}
    </Link>
  );
};

const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center p-2 rounded-full hover:bg-secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="sr-only">User menu</span>
        <User className="w-6 h-6" />
        <ChevronDown className="w-5 h-5 ml-1" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-popover rounded-md shadow-lg py-1 z-50"
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-base text-popover-foreground hover:bg-secondary"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-base text-popover-foreground hover:bg-secondary"
            >
              Settings
            </Link>
            <button className="block w-full text-left px-4 py-2 text-base text-popover-foreground hover:bg-secondary">
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApiHealthy, setIsApiHealthy] = useState(false);
  const navItems = useMemo(
    () => ["Dashboard", "Strategies", "Regimes", "Insights"],
    []
  );

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthStatus = await checkApiHealth();
        setIsApiHealthy(healthStatus.status === "healthy");
      } catch (error) {
        console.error("Error checking API health:", error);
        setIsApiHealthy(false);
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-7 w-7" />
            <span className="sr-only">Toggle menu</span>
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Investment-X</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavbarItem key={item} targetPath={item} />
          ))}
          {isApiHealthy && (
            <Link
              href="/docs"
              className="flex items-center px-4 py-2 text-base font-medium transition-all rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              API Docs
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <ModeToggle />
          <NavbarUser />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            id="mobile-menu"
          >
            <div className="container flex flex-col space-y-2 py-4 mx-auto px-4 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <NavbarItem key={item} targetPath={item} />
              ))}
              {isApiHealthy && (
                <Link
                  href="/docs"
                  className="flex items-center px-4 py-2 text-base font-medium transition-all rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API Docs
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
