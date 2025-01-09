import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Reusable NavLink Component
const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-lg font-semibold px-4 py-2 transition-colors duration-300 ease-in-out ${
        isActive
          ? "text-white"
          : "text-gray-400 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

export default NavLink;
