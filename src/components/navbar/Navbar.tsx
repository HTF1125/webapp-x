"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import LogoDark from "@/images/investment-x-logo-dark.svg";
import LogoLight from "@/images/investment-x-logo-light.svg";
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

const ThemeToggle = dynamic(() => import('../ThemeToggle'), {
  ssr: false,
  loading: () => <div className="w-6 h-6" />
});

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const NavbarItem = React.memo(({ targetPath, onClick }: { targetPath: string; onClick: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const formatTargetPath = useCallback((path: string) => {
    return path
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const isActive = pathname === `/${targetPath.toLowerCase()}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
    router.push(`/${targetPath.toLowerCase()}`);
  };

  return (
    <Link
      href={`/${targetPath.toLowerCase()}`}
      onClick={handleClick}
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
});

NavbarItem.displayName = 'NavbarItem';

const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      menuRef.current?.querySelector('a')?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
            ref={menuRef}
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
            <div className="px-4 py-2">
              <ThemeToggle aria-label="Toggle theme" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = useMemo(
    () => ["Dashboard", "Strategies", "Regimes", "Insights"],
    []
  );
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {isMobile && (
            <button
              className="mr-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              <span className="sr-only">Toggle menu</span>
            </button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={theme === "dark" ? LogoLight : LogoDark}
              alt="Investment-X Logo"
              className="w-auto h-auto min-w-[24px] max-w-[200px]"
              style={{
                width: "100%",
                height: "auto",
              }}
              priority
            />
          </Link>
        </div>

        {!isMobile && (
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <NavbarItem key={item} targetPath={item} onClick={closeMenu} />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <NavbarUser />
        </div>
      </div>

      {isMobile && isMenuOpen && createPortal(
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="fixed inset-0 z-50 bg-background"
          id="mobile-menu"
        >
          <div className="container flex flex-col space-y-2 py-4 mx-auto px-4 sm:px-6 lg:px-8">
            {navItems.map((item) => (
              <NavbarItem key={item} targetPath={item} onClick={closeMenu} />
            ))}
          </div>
        </motion.div>,
        document.body
      )}
    </nav>
  );
}
