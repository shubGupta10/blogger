'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; 

  return (
    <>
      {resolvedTheme === 'dark' ? (
        <Sun onClick={() => setTheme('light')} className="w-7 h-7 cursor-pointer" />  
      ) : (
        <Moon onClick={() => setTheme('dark')} className="w-7 h-7 cursor-pointer" />  
      )}
    </>
  );
}
