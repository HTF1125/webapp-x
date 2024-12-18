"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Key, LogOut } from "lucide-react"; // Using Key icon for Sign In
import { useAuth } from "@/components/LoginProvider";

const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();

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

  const handleMenuClose = () => {
    setIsOpen(false); // Close the menu
  };

  return (
    <div className="relative inline-block">
      {/* Button to toggle the dropdown */}
      <button
        className="flex items-center p-2 rounded-full hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isAuthenticated ? (
          <>
            <User className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-200" />
            <ChevronDown className="w-5 h-5 ml-1 text-gray-400 hover:text-white transition-colors duration-200" />
          </>
        ) : (
          <Key className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-200" /> // Using Key icon for sign-in
        )}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-xl py-2 z-50 border border-gray-600"
          >
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
                  onClick={handleMenuClose} // Close menu on click
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
                  onClick={handleMenuClose} // Close menu on click
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    handleMenuClose(); // Close menu on logout
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
                >
                  Sign out
                  <LogOut className="inline ml-2 w-4 h-4 text-gray-400" />
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="block px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
                onClick={handleMenuClose} // Close menu on click
              >
                Sign in
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarUser;
