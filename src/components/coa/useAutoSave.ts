import { useEffect, useRef } from "react";

export const useAutoSave = (
  watch: any,
  setData: (data: any) => void,
  delay = 300
) => {
  const prevRef = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = watch((values: any) => {
      const stringified = JSON.stringify(values);

      // prevent unnecessary updates
      if (stringified === prevRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        prevRef.current = stringified;
        setData(values);
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, setData, delay]);
};