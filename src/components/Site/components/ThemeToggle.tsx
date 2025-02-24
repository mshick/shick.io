'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center m-2 p-0 hover:text-white hover:bg-blue-700 focus:outline-hidden"
    >
      <span className="sr-only">Dark / light theme toggle</span>
      {theme === 'dark' ? (
        <span
          className="block"
          aria-hidden="true"
          title="Switch to the light theme"
          onClick={() => setTheme('light')}
        >
          [☀︎]
        </span>
      ) : (
        <span
          className="block"
          aria-hidden="true"
          title="Switch to the dark theme"
          onClick={() => setTheme('dark')}
        >
          [☀︎]
        </span>
      )}
    </button>
  );
}
