"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";

export function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <ThemeSwitcher
        onChange={setTheme}
        value={theme as "light" | "dark" | "system"}
      />
    </>
  );
}
