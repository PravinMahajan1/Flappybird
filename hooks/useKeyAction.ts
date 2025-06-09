
import { useEffect, useCallback } from 'react';

export const useKeyAction = (targetKey: string, callback: () => void, isActive: boolean = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    if (event.key === targetKey || event.code === targetKey) {
      event.preventDefault(); // Prevent space bar from scrolling page
      callback();
    }
  }, [targetKey, callback, isActive]);

  useEffect(() => {
    if (!isActive) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isActive]);
};
