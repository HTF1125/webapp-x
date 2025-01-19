"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarUser from "./sidebar-user";
import ResponsiveLogo from "./logo";
import { Spacer } from "@nextui-org/react";
import { ThemeSwitch } from "../ThemeSwitch";
import { sectionItems } from "./sectionItems";

export type SidebarMenuItemProps = {
  key: string;
  href: string;
  icon: React.ReactNode;
  title: string;
  notification?: React.ReactNode;
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  href,
  icon,
  title,
  notification,
}) => {
  return (
    <li className="w-full">
      <Link href={href} className="block w-full">
        <div className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none relative">
          {/* Icon + Notification */}
          <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 flex items-center relative">
            {icon}
            {notification && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-red-500">
                {notification}
              </span>
            )}
          </span>
          {/* Title */}
          <span
            className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 hidden md:inline truncate"
            style={{ maxWidth: "120px" }}
          >
            {title}
          </span>
        </div>
      </Link>
    </li>
  );
};

const SidebarSection: React.FC<{
  title: string;
  items: SidebarMenuItemProps[];
}> = ({ title, items }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <li className="menu-section w-full">
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none md:text-sm"
      >
        <span className="truncate">{title}</span>
        <span>{collapsed ? "▼" : "▲"}</span>
      </button>
      <ul
        className={`transition-all duration-300 ${
          collapsed ? "hidden" : "block"
        }`}
      >
        {items.map((item) => (
          <SidebarMenuItem
            key={item.key}
            href={item.href}
            icon={item.icon}
            title={item.title}
            notification={item.notification}
          />
        ))}
      </ul>
    </li>
  );
};

const SidebarMenu: React.FC<{ sections: typeof sectionItems }> = ({
  sections,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="relative flex flex-col h-full text-gray-900 dark:text-gray-100 p-4 border-r border-gray-300 dark:border-gray-700">
          <ResponsiveLogo />
          <Spacer y={6} />
          {/* Navigation */}
          <nav aria-label="Sidebar navigation">
            <ul className="sidebar-menu space-y-6">
              {sections.map((section) => (
                <SidebarSection
                  key={section.key}
                  title={section.title}
                  items={section.items}
                />
              ))}
            </ul>
          </nav>
          <Spacer y={6} />
          {/* User Menu */}
          <SidebarUser />
          <Spacer y={6} />
          {/* Theme Switch */}
          <ThemeSwitch />
          <div className="mt-auto text-center text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            <p>&copy; 2025 Investment-X</p>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export { SidebarMenu };
