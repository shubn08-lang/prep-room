"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    setTheme(t === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("verve-theme", next);
    } catch {
      // storage can be blocked, the theme still changes for this visit
    }
    setTheme(next);
  }

  if (!theme) return null;

  return (
    <button
      onClick={toggle}
      aria-label="Switch between dark and light mode"
      className="w-full rounded-md border border-line px-3 py-2 text-left text-sm text-muted hover:text-ink"
    >
      {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    </button>
  );
}