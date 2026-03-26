import { useEffect, useRef } from "react";

export const useAutoSave = (watchFn: any, setData: (data: any) => void, delay = 300) => {
  const prevRef = useRef<any>(null);
  const watched = watchFn();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!prevRef.current || JSON.stringify(prevRef.current) !== JSON.stringify(watched)) {
        prevRef.current = watched;
        setData(watched);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [watched, setData, delay]);
};
