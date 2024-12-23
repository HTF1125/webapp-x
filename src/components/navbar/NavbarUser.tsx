// src/components/navbar/NavbarUser.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  ChevronDown,
  LogOut,
  Settings,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NavbarUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, logout, loading } = useAuth();

  // Debugging: Log authentication and admin status
  useEffect(() => {
    console.log(
      "NavbarUser - isAuthenticated:",
      isAuthenticated,
      "isAdmin:",
      isAdmin,
      "loading:",
      loading
    );
  }, [isAuthenticated, isAdmin, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Set focus to the first interactive element in the menu
      const firstFocusable = menuRef.current?.querySelector(
        "a, button"
      ) as HTMLElement | null;
      firstFocusable?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleMenuClose = () => {
    setIsOpen(false); // Close the menu
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      console.log("User has logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, display an error message to the user
    }
  };

  // Enhanced Icon Rendering
  const renderIcon = () => {
    if (isAuthenticated && isAdmin) {
      return (
        <div className="flex items-center space-x-1">
          <Shield className="w-6 h-6 text-yellow-500" />
          <Crown className="w-4 h-4 text-yellow-500" />
          <ChevronDown className="w-5 h-5 text-yellow-500" />
          <span className="sr-only">Admin Menu</span>
        </div>
      );
    } else if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-1">
          <User className="w-6 h-6 text-gray-400" />
          <ChevronDown className="w-5 h-5 text-gray-400" />
          <span className="sr-only">User Menu</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <User className="w-6 h-6 text-gray-400" />
          <span className="sr-only">Sign In</span>
        </div>
      );
    }
  };

  // Dropdown Menu Items
  const renderMenuItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
            onClick={handleMenuClose}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
            onClick={handleMenuClose}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
              onClick={handleMenuClose}
            >
              <Shield className="w-4 h-4 mr-2 text-yellow-500" />
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </>
      );
    } else {
      return (
        <Link
          href="/sign-in"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 focus:bg-gray-700 rounded-md transition-all"
          onClick={handleMenuClose}
        >
          <User className="w-4 h-4 mr-2" />
          Sign in
        </Link>
      );
    }
  };

  // Prevent rendering the user menu if still loading
  if (loading) {
    return (
      <button
        className="flex items-center p-2 rounded-full bg-gray-700 cursor-not-allowed"
        disabled
        aria-label="Loading user menu"
      >
        <User className="w-6 h-6 text-gray-400" />
        <ChevronDown className="w-5 h-5 ml-1 text-gray-400" />
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Button to toggle the dropdown */}
      <button
        className="flex items-center p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {renderIcon()}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-xl py-2 z-50 border border-gray-700"
          >
            {renderMenuItems()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarUser;
