"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import NavLink from "./NavLink";

const MenuNav: React.FC = () => {
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Insights", path: "/insights" },
    { label: "Views", path: "/views" },
    { label: "Strategies", path: "/strategies" },
  ];

  return (
    <nav className="hidden sm:flex sticky top-0 z-50 flex-col h-screen backdrop-blur-lg bg-gradient-to-b from-black via-gray-900 to-gray-800 bg-opacity-95 border-r border-gray-700 shadow-xl">
      <div className="flex flex-col h-full items-center justify-between p-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={LogoLightColor}
            alt="Investment-X Logo"
            className="w-auto h-auto min-w-[40px] max-w-[150px]"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-col items-center gap-4 w-full">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <NavLink href={item.path}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer or Additional Actions */}
        <div className="mt-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 Investment-X</p>
        </div>
      </div>
    </nav>
  );
};

export default MenuNav;