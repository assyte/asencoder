"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * 🌗 Tema değiştirme toggle.
 * - localStorage'a kaydeder
 * - Sayfa yüklendiğinde state'i hydrate eder (FOUC önleme layout'taki
 *   inline script tarafından hallediliyor, burada sadece UI güncellenir).
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("asencoder-theme", next);
    } catch {
      // yok say
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${theme === "dark" ? "Aydınlık" : "Karanlık"} moda geç`}
      className="theme-toggle"
      title={theme === "dark" ? "Aydınlık tema" : "Karanlık tema"}
    >
      <span className="theme-toggle__track" />
      <span
        aria-hidden
        className="relative z-10 ml-1 text-xs leading-none text-white"
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        {theme === "dark" ? "☾" : "☀"}
      </span>
      <span
        aria-hidden
        className="relative z-10 mr-1 ml-auto text-xs leading-none text-text-muted"
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
