"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import LogoDarkColor from "@/images/investment-x-logo-dark.svg";
import { ThemeSwitch } from "../ThemeSwitch";
import { usePathname } from "next/navigation";
import NavbarUser from "./NavbarUser"; // Import NavbarUser

// NavLink Component
const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block text-lg font-medium px-4 py-2 rounded-md transition-colors duration-300 ease-in-out w-full text-center 
        ${isActive ? "bg-primary text-primary-foreground" : "text-foreground-500 hover:text-foreground hover:bg-default-100"}
      `}
      aria-current={isActive ? "page" : undefined}
      role="link"
      tabIndex={0}
    >
      {children}
    </Link>
  );
};

// MenuNav Component
const MenuNav: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Insights", path: "/insights" },
    { label: "Views", path: "/views" },
    { label: "Strategies", path: "/strategies" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="hidden sm:flex sticky top-0 z-50 flex-col h-screen bg-background border-r border-divider shadow-lg">
      <div className="flex flex-col h-full items-center justify-between p-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-[150px] h-[40px]">
            {mounted && (
              <Image
                src={resolvedTheme === "dark" ? LogoLightColor : LogoDarkColor}
                alt="Investment-X Logo"
                fill
                sizes="150px"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-col items-center gap-4 w-full">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <NavLink href={item.path}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        {/* User Navbar */}
        <div className="mt-auto mb-4 w-full flex justify-center">
          <NavbarUser /> {/* Include NavbarUser here */}
        </div>

        {/* Theme Switch */}
        <div className="mt-auto mb-4 flex items-center justify-center">
          <ThemeSwitch />
        </div>

        {/* Footer or Additional Actions */}
        <div className="text-center text-default-500 text-sm mt-4">
          <p>&copy; 2025 Investment-X</p>
        </div>
      </div>
    </nav>
  );
};

export default MenuNav;
