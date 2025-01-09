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
import { useAuth } from "@/context/Auth/AuthContext";

const NavbarUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      console.log("User has logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderIcon = () => {
    if (isAuthenticated && isAdmin) {
      return (
        <div className="flex items-center space-x-1">
          <Shield className="w-6 h-6 text-yellow-500" />
          <Crown className="w-4 h-4 text-yellow-500" />
          <ChevronDown className="w-5 h-5 text-yellow-500" />
        </div>
      );
    } else if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-1">
          <User className="w-6 h-6 text-gray-400" />
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      );
    } else {
      return (
        <Link href="/sign-in" className="flex items-center space-x-1">
          <User className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400 text-nowrap">Sign In</span>
        </Link>
      );
    }
  };

  const renderMenuItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
            onClick={handleMenuClose}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
            onClick={handleMenuClose}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
              onClick={handleMenuClose}
            >
              <Shield className="w-4 h-4 mr-2 text-yellow-500" />
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center p-2 rounded-full hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {renderIcon()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg py-2 z-50"
          >
            {renderMenuItems()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarUser;
