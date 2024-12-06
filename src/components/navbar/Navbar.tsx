"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown } from "lucide-react";
import Image from "next/image";
import LogoLightColor from "@/images/investment-x-logo-light.svg";

const NavbarItem = React.memo(
  ({ targetPath, onClick }: { targetPath: string; onClick: () => void }) => {
    return (
      <Link
        href={`/${targetPath.toLowerCase()}`}
        onClick={onClick}
        className="text-gray-300 hover:text-white text-lg font-medium px-4 py-1 transition"
      >
        {targetPath}
      </Link>
    );
  }
);

NavbarItem.displayName = "NavbarItem";

const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      menuRef.current?.querySelector("a")?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center p-2 rounded-full hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <User className="w-6 h-6 text-gray-600 hover:text-black" />
        <ChevronDown className="w-5 h-5 ml-1 text-gray-600 hover:text-black" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56  text-white rounded-md shadow-lg py-1 z-50 border border-gray-300"
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Settings
            </Link>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [navItems] = useState(["Insights"]);

  const handleNavClick = useCallback(() => {
    // Add logic here if needed when navigating
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg  border-b border-gray-300 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={LogoLightColor}
              alt="Investment-X Logo"
              className="w-auto h-auto min-w-[20px] max-w-[200px]"
              priority
            />
          </Link>
        </div>
        {/* Right Section: Navigation Items */}
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <NavbarItem key={item} targetPath={item} onClick={handleNavClick} />
          ))}
        </div>

        {/* User Menu */}
        <NavbarUser />
      </div>
    </nav>
  );
}
