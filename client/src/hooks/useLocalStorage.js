import { useState } from 'react';

// CUSTOM HOOK: useState that is saved in localStorage
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next) => {
    setValue(next);
    if (next === null || next === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, set];
}
