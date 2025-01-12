"use client";

import React from "react";
import { Button, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@nextui-org/react";
import Sidebar from "./sidebar";
import sectionItems from "./sidebar-items";
import ResponsiveLogo from "./logo";
import SidebarUser from "./sidebar-user";

const COMPACT_WIDTH = 768;

function createSidebar(isCompact: boolean) {
  const sidebarClasses = cn(
    "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
    { "w-16 items-center px-2 py-6": isCompact }
  );

  const bottomSectionClasses = cn("mt-auto flex flex-col", {
    "items-center": isCompact,
  });

  const renderActionButton = (icon: string, text: string, tooltip: string) => (
    <Tooltip content={tooltip} isDisabled={!isCompact} placement="right">
      <Button
        fullWidth
        className={cn(
          "justify-start text-default-500 data-[hover=true]:text-foreground",
          { "justify-center": isCompact }
        )}
        isIconOnly={isCompact}
        startContent={
          !isCompact && (
            <Icon
              className="flex-none text-default-500"
              icon={icon}
              width={24}
            />
          )
        }
        variant="light"
      >
        {isCompact ? (
          <Icon className="text-default-500" icon={icon} width={24} />
        ) : (
          text
        )}
      </Button>
    </Tooltip>
  );

  return (
    <div className={sidebarClasses}>
      <ResponsiveLogo isCompact={isCompact} />
      <Spacer y={6} />
      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar
          defaultSelectedKey="home"
          isCompact={isCompact}
          items={sectionItems}
        />
      </ScrollShadow>
      <Spacer y={2} />
      <SidebarUser isCompact={isCompact} />
      <Spacer y={2} />
      <div className={bottomSectionClasses}>
        {renderActionButton(
          "solar:info-circle-line-duotone",
          "Help & Information",
          "Help & Feedback"
        )}
      </div>
      <div className="text-center text-default-500 text-sm mt-4">
        <p>&copy; 2025 Investment-X</p>
      </div>
    </div>
  );
}

export default function SidebarPage() {
  const isCompact = useMediaQuery(`(max-width: ${COMPACT_WIDTH}px)`);
  return createSidebar(isCompact);
}
