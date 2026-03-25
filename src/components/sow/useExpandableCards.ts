import { useState, useEffect } from "react";

export const useExpandableCards = (count: number, initialExpanded?: boolean[]) => {
  const [expanded, setExpanded] = useState<boolean[]>(() => {
    if (initialExpanded && initialExpanded.length === count) {
      return initialExpanded;
    }
    return Array(count).fill(true); // fallback if no initialExpanded
  });

  // When cards are added/removed, sync the expanded array
  useEffect(() => {
    setExpanded(prev => {
      const next = [...prev];

      while (next.length < count) next.push(true); // add missing
      return next.slice(0, count); // trim extra
    });
  }, [count]);

  const toggleExpand = (index: number) => {
    setExpanded(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return { expanded, toggleExpand, setExpanded };
};