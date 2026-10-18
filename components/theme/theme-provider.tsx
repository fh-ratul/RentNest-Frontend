"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "rentnest-theme";

// Runs in <head> before first paint so the page never flashes the wrong theme.
// It also marks <html> with `js`, which scroll-reveal styles key off.
export const themeScript = `(function(){try{var d=document.documentElement;d.classList.add("js");var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var r=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;d.classList.toggle("dark",r==="dark");}catch(e){}})()`;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The source of truth is localStorage (the choice) and the `dark` class on
// <html> (what's applied), so React subscribes to them as an external store.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const systemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
};

const readAppliedTheme = (): ResolvedTheme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const applyTheme = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  notify();
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readStoredTheme, () => "system" as Theme);
  const resolvedTheme = useSyncExternalStore(subscribe, readAppliedTheme, () => "light" as ResolvedTheme);

  // Marks the page as interactive; scroll-reveal's no-JS fallback keys off this.
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  // Follow the OS while the user hasn't picked a theme.
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(systemTheme());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback<ThemeContextValue["setTheme"]>((next, origin) => {
    const resolved = next === "system" ? systemTheme() : next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion || resolved === readAppliedTheme()) {
      applyTheme(resolved);
      return;
    }

    // Grow the new theme in a circle from where the user clicked.
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.setAttribute("data-theme-switching", "");

    const transition = document.startViewTransition(() => applyTheme(resolved));
    transition.finished.finally(() => root.removeAttribute("data-theme-switching"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
