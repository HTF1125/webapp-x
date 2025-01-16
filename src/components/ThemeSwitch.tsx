// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { SunIcon, MoonIcon } from "@nextui-org/shared-icons";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      isSelected={theme === "dark"}
      size="lg"
      color="warning"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    />
  );
}
