import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yann — Full-Stack Software Engineer",
  description: "Portfolio",
};

function ThemeInit() {
  // Runs before React hydration to avoid light/dark flash
  const code = `
  try {
    const ls = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (ls === 'dark' || (!ls && prefersDark)) document.documentElement.classList.add('dark');
  } catch {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <ThemeInit />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Ctext y=%27.9em%27 font-size=%2790%27%3E%F0%9F%9A%80%3C/text%3E%3C/svg%3E" />
      </head>
      <body className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-300/40 dark:selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
