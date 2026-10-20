"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "asencoder-theme";

/**
 * Tema durumunu abone olarak oku.
 *
 * Neden `useSyncExternalStore`: Tema, `<head>` içindeki inline script ile
 * hydrate ÖNCESİ uygulanır (FOUC önleme). Bu yüzden React'in ilk render'ında
 * doğru değeri bilmesi gerekir. `useEffect` + `setState` yaklaşımı:
 *
 *   1. İlk render'da "dark" varsayar → hydration uyuşmazlığı (React 18 hata verir)
 *   2. Effect içinde setState → cascading render, gereksiz tur
 *
 * `useSyncExternalStore` bu ikisini de çözer: sunucu snapshot'ı ile istemci
 * snapshot'ını karşılaştırır, hydration sırasında doğru değeri kullanır ve
 * dış sistem değişimlerine abone olur.
 */

/** Tema değiştiğinde abonelere haber verir. */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

/** `document` yalnızca tarayıcıda var; SSR'da snapshot döndürmüyoruz. */
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  // Sunucu her zaman koyu tema varsayar. Hydration sonrası istemci
  // gerçek değeri devralır ve React farkı sessizce düzeltir.
  return "dark";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage erişimi reddedilirse (gizli sekme, kısıtlı izin)
      // yalnızca DOM özniteliği güncellenir, tema yine de değişir.
    }
    emit();
  }, [theme]);

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
      >
        {theme === "dark" ? "☾" : "☀"}
      </span>
      <span
        aria-hidden
        className="relative z-10 mr-1 ml-auto text-xs leading-none text-text-muted"
      >
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}