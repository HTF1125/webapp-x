// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Set mounted to true after the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until the component is mounted
  if (!mounted) return null;

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Define button styles based on the current theme
  const buttonStyles = theme === "dark"
    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
    : "bg-yellow-400 text-gray-800 hover:bg-yellow-500";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`flex items-center justify-center p-3 rounded-full transition duration-300 ease-in-out ${buttonStyles} shadow-md`}
    >
      {theme === "dark" ? (
        <FaSun className="w-6 h-6" />
      ) : (
        <FaMoon className="w-6 h-6" />
      )}
    </button>
  );
}
