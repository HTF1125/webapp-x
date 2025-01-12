"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Listbox, Tooltip, ListboxItem } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import LogoLightColor from "@/images/investment-x-logo-light.svg";
import LogoDarkColor from "@/images/investment-x-logo-dark.svg";
import { ThemeSwitch } from "../ThemeSwitch";
import NavbarUser from "./NavbarUser";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

const MenuNav: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: SidebarItem[] = [
    { key: "dashboard", title: "Dashboard", icon: "solar:home-2-linear", href: "/dashboard" },
    { key: "insights", title: "Insights", icon: "solar:widget-2-outline", href: "/insights" },
    { key: "views", title: "Views", icon: "solar:chart-outline", href: "/views" },
    { key: "strategies", title: "Strategies", icon: "solar:checklist-minimalistic-outline", href: "/strategies" },
  ];

  const renderItem = (item: SidebarItem) => (
    <ListboxItem
      key={item.key}
      href={item.href}
      startContent={
        item.icon && (
          <Icon
            className="text-default-500 group-data-[selected=true]:text-foreground"
            icon={item.icon}
            width={24}
          />
        )
      }
      endContent={!isCompact && item.endContent}
    >
      {isCompact ? (
        <Tooltip content={item.title} placement="right">
          <span className="sr-only">{item.title}</span>
        </Tooltip>
      ) : (
        item.title
      )}
    </ListboxItem>
  );

  return (
    <nav className={`sticky top-0 z-50 flex-col h-screen bg-background border-r border-divider shadow-lg transition-all duration-300 ${isCompact ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full items-center justify-between p-4">
        <div className="w-full">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className={`relative ${isCompact ? 'w-10 h-10' : 'w-[150px] h-[40px]'}`}>
              {mounted && (
                <Image
                  src={resolvedTheme === "dark" ? LogoLightColor : LogoDarkColor}
                  alt="Investment-X Logo"
                  fill
                  sizes={isCompact ? "40px" : "150px"}
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
          </Link>

          <Listbox
            aria-label="Navigation Menu"
            className="p-0"
            itemClasses={{
              base: "data-[selected=true]:bg-default-100",
            }}
            items={navItems}
            selectionMode="single"
            selectedKeys={[pathname]}
          >
            {(item) => renderItem(item)}
          </Listbox>
        </div>

        <div className="mt-auto w-full">
          <NavbarUser />
          <div className="mt-4 flex items-center justify-center">
            <ThemeSwitch />
          </div>
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="mt-4 w-full text-default-500 hover:text-foreground"
          >
            <Icon icon={isCompact ? "solar:sidebar-minimalistic-outline" : "solar:sidebar-minimalistic-linear"} width={24} />
          </button>
          <div className="text-center text-default-500 text-sm mt-4">
            <p>&copy; 2025 Investment-X</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuNav;
