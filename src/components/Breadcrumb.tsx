// app/insights/components/Breadcrumb.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  separator?: string; // separator between breadcrumb items
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ separator = "/" }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // capitalize segment label
      href,
    };
  });

  return (
    <nav aria-label="breadcrumb" className="flex space-x-2 text-gray-500">
      <Link href="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <span>{separator}</span>
          <Link href={item.href} className="text-blue-500 hover:underline">
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
