"use client";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Рендеринг только после присоединения
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="overflow-hidden relative rounded-full border-2 transition-colors cursor-pointer bg-element-bg border-gray-color-3 hover:bg-gray-color-4"
    >
      <Sun
        className={`h-5 w-5 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"} text-text-2-color`}
      />
    </Button>
  );
}
