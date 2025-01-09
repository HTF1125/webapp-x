"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import NavLink from "./NavLink";

const MenuNav: React.FC = () => {
  const navItems = ["Dashboard", "Insights", "Views", "Strategies"];

  return (
    <nav className="hidden sm:block sticky top-0 z-50 backdrop-blur-md bg-black bg-opacity-95 border-r border-gray-700 shadow-lg">
      <div className="container flex flex-col h-full items-center justify-start mx-auto p-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={LogoLightColor}
            alt="Investment-X Logo"
            className="w-auto h-auto min-w-[20px] max-w-[200px]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex flex-col items-start">
          {navItems.map((item) => (
            <NavLink
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => {}}
            >
              {item}
            </NavLink>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default MenuNav;
