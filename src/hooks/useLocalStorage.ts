import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

/**
 * Type-safe persistent browser storage hook with JSON parsing and fallback recovery.
 *
 * @param key The key under which the value is stored in localStorage
 * @param initialValue Default value to use if key doesn't exist or parsing fails
 * @returns [storedValue, setValue] tuple identical to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch (error: unknown) {
      logger.warn(`Error reading localStorage key "${key}", reverting to default:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error: unknown) {
      logger.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
