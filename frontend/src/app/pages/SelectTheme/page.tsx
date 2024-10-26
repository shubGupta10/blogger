'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SelectTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { name: 'System', value: 'system' },
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-black transition-colors duration-300">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Select Your Theme
      </h1>
      <ul className="space-y-4 w-full max-w-md">
        {themes.map((themeOption) => (
          <li key={themeOption.value} className="relative">
            <Button
              variant={theme === themeOption.value ? 'default' : 'outline'}
              onClick={() => setTheme(themeOption.value)}
              className="w-full h-12 text-lg font-medium transition-all duration-300 ease-in-out   focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              {themeOption.name}
            </Button>
            {theme === themeOption.value && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-extrabold">
                &#10003;
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
        Choose your preferred theme for a personalized experience tailored to your environment.
      </p>
    </div>
  );
}
