"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import { Spacer } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion"; // For better animations
import { ThemeSwitch } from "../ThemeSwitch";
import { sectionItems } from "./sectionItems";

export type SidebarMenuItemProps = {
  key: string;
  href: string;
  icon: React.ReactNode;
  title: string;
  notification?: React.ReactNode;
  onClick?: () => void; // Optional click handler
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  href,
  icon,
  title,
  notification,
  onClick,
}) => (
  <li>
    <Link href={href} onClick={onClick}>
      <div className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
        <div className="relative flex items-center">
          {icon}
          {notification && (
            <span className="absolute top-0 right-0 text-xs text-red-500 transform translate-x-1/2 -translate-y-1/2">
              {notification}
            </span>
          )}
        </div>
        <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
      </div>
    </Link>
  </li>
);

const SidebarSection: React.FC<{
  title: string;
  items: SidebarMenuItemProps[];
  onItemClick: () => void;
}> = ({ title, items, onItemClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <li>
      <button
        onClick={toggleCollapse}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
      >
        {title}
        <span>{collapsed ? "▼" : "▲"}</span>
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-3 overflow-hidden"
          >
            {items.map((item) => (
              <SidebarMenuItem
                key={item.key}
                href={item.href}
                icon={item.icon}
                title={item.title}
                notification={item.notification}
                onClick={onItemClick}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const SidebarMenu: React.FC<{ sections: typeof sectionItems }> = ({ sections }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 bg-gray-300 dark:bg-gray-800 rounded-md shadow-md focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              My App
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
            {sections.map((section) => (
              <SidebarSection
                key={section.key}
                title={section.title}
                items={section.items}
                onItemClick={toggleSidebar}
              />
            ))}
          </nav>

          {/* Theme Switch */}
          <div className="p-4 border-t dark:border-gray-800">
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
        />
      )}
    </>
  );
};

export { SidebarMenu };
