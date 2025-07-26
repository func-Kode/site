'use client';

import { useState, useEffect, useCallback } from 'react';
import { DebugConsole } from './debug-console';

interface DebugConsoleProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function DebugConsoleProvider({ children, enabled = false }: DebugConsoleProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleConsole = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+D to toggle debug console
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        toggleConsole();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, toggleConsole]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <DebugConsole isVisible={isVisible} onToggle={toggleConsole} />
    </>
  );
}
