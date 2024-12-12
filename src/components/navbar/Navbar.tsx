"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import NavbarUser from "@/components/navbar/User";

const NavbarItem = React.memo(
  ({ targetPath, onClick }: { targetPath: string; onClick: () => void }) => (
    <Link
      href={`/${targetPath.toLowerCase()}`}
      onClick={onClick}
      className="text-gray-400 hover:text-white text-lg font-medium px-4 py-1 transition"
    >
      {targetPath}
    </Link>
  )
);

NavbarItem.displayName = "NavbarItem";

export default function Navbar() {
  const [navItems] = useState(["Insights", "Strategies"]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-900 bg-opacity-95 border-b border-gray-700 shadow-md">
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

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden flex items-center text-gray-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavbarItem key={item} targetPath={item} onClick={() => {}} />
          ))}
        </div>

        {/* User Menu */}
        <NavbarUser />
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden bg-gray-800 text-gray-400 shadow-lg"
          >
            <div className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-lg font-medium px-4 py-2 hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
