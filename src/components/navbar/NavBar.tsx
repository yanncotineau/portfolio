"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change / hash change for better UX
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full px-2 sm:px-4 lg:px-8">
        <div className="mt-3 flex items-center justify-between rounded-xl glass px-3 sm:px-4 py-2 sm:py-3 shadow-soft text-black dark:text-slate-100">
          {/* Brand */}
          <Link href="#home" className="group inline-flex items-center gap-2 whitespace-nowrap">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-tight text-sm sm:text-base">Yann — Full-Stack Software Engineer</span>
            <span className="sr-only">Home</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 text-sm whitespace-nowrap">
            {[
              ["#about", "About"],
              ["#skills", "Skills"],
              ["#blog", "Blog"],
              ["#experience", "Experience"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="px-3 py-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5">
                {label}
              </Link>
            ))}
            <ThemeToggle className="ml-2" />
          </div>

          {/* Mobile quick links + menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="max-w-[58vw] overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
              {[
                ["#about", "About"],
                ["#skills", "Skills"],
                ["#blog", "Blog"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="px-2 py-1 rounded hover:bg-slate-900/5 dark:hover:bg-white/5">
                  {label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 hover:bg-slate-900/5 dark:hover:bg-white/5"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 rounded-xl glass px-4 py-3 shadow-soft">
            <div className="grid gap-1 text-sm">
              {[
                ["#about", "About"],
                ["#skills", "Skills"],
                ["#blog", "Blog"],
                ["#experience", "Experience"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <ThemeToggle className="mt-2" />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
