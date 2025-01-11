import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = React.memo(({ href, children }) => {
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
});

NavLink.displayName = 'NavLink';

export default NavLink;
