"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  ChevronRight,
  LogOut,
  Settings,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/Auth/AuthContext";

const SidebarUser: React.FC<{ isCompact: boolean }> = ({ isCompact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

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

  useEffect(() => {
    const checkPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setShowAbove(spaceBelow < 200); // Adjust 200 based on your menu height
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  const handleMenuClose = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      console.log("User has logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    const names = name.split(' ');
    return names.map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const renderUserAvatar = () => {
    const initials = getInitials(user?.username);
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-600 text-white font-semibold">
        {initials}
      </div>
    );
  };

  const renderIcon = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-2">
          {renderUserAvatar()}
          {!isCompact && (
            <>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {user?.username || "User"}
              </span>
              {isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
              <ChevronRight 
                className={`w-4 h-4 transition-transform ${isOpen ? (showAbove ? 'rotate-[-90deg]' : 'rotate-90') : ''}`} 
              />
            </>
          )}
        </div>
      );
    } else {
      return (
        <Link href="/sign-in" className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          {!isCompact && <span className="text-sm">Sign In</span>}
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
    }
    return null;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center p-2 rounded-md hover:bg-gray-700 focus:outline-none w-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {renderIcon()}
      </button>

      <AnimatePresence>
        {isOpen && !isCompact && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: showAbove ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: showAbove ? 10 : -10 }}
            className={`absolute ${showAbove ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-full bg-gray-800 text-white rounded-md shadow-lg py-2 z-10`}
          >
            {renderMenuItems()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarUser;
