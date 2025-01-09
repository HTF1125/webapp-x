// Updated NavLink Component
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
        ${isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

export default NavLink;
