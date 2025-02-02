"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, LogOut, Settings, LogIn } from "lucide-react"; // Added LogIn icon
import { useAuth } from "@/context/Auth/AuthContext";

const TopNavUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      console.log("User has logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "UN";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Render user avatar
  const renderUserAvatar = () => {
    const initials = getInitials(user?.username);
    return (
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white dark:bg-gray-300 dark:text-gray-800 font-semibold hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors"
        title={user?.username || "User"}
      >
        {initials}
      </div>
    );
  };

  // Render placeholder for non-logged-in users
  const renderPlaceholder = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white dark:bg-gray-300 dark:text-gray-800 font-semibold hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors"
        title="Sign In"
      >
        <LogIn className="w-4 h-4" /> {/* Use the LogIn icon */}
      </div>
    );
  };

  // Render dropdown menu items
  const renderMenuItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-4 h-4 mr-2 text-yellow-500" />
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <>
          <div
            ref={buttonRef}
            role="button"
            tabIndex={0}
            className="flex items-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(!isOpen);
              }
            }}
            aria-haspopup="true" // Keep this for accessibility
          >
            {renderUserAvatar()}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50"
              >
                {renderMenuItems()}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href="/sign-in"
          className="flex items-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          {renderPlaceholder()} {/* Use the placeholder for non-logged-in users */}
        </Link>
      )}
    </div>
  );
};

export default TopNavUser;
