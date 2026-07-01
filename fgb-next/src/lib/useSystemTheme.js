"use client";

import { useState, useEffect } from "react";

const useSystemTheme = () => {
  // Start with "light" on both server and first client render so
  // hydration output matches, then sync to the real value on mount.
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");
    const handleChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return theme;
};

export default useSystemTheme;
