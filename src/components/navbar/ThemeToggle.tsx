"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const onClick = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/5 ${className}`}
      aria-label="Toggle theme"
    >
      {/* show Moon in light mode, Sun in dark mode */}
      <Moon className="h-5 w-5 dark:hidden" />
      <Sun className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
