import { useState } from "react";

function useLocalStorage<V>(key: string, initialValue: V) {
  const [storedValue, setStoredValue] = useState<V>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    } else {
      return initialValue;
    }
  });
  const setValue = (value: V | ((val: V) => V)) => {
    if (typeof window !== "undefined") {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn(
        "useLocalStorage hook unable to access platform (window) localStorage "
      );
      setStoredValue(value);
    }
  };
  return [storedValue, setValue] as const;
}

export default useLocalStorage;
