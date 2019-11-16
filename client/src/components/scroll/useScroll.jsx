import {
  useEffect, useRef, useState, useCallback,
} from 'react';

export default function useScroll() {
  const scrollRef = useRef(null);
  const intervalId = useRef(null);

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    if (scrollRef.current != null && scrolling) {
      intervalId.current = setInterval(() => {
        setScrolling(true);
        scrollRef.current.scrollBy({ left: 0, top: 2 });
      }, 100);
    }

    return () => clearInterval(intervalId.current);
  }, [scrolling]);

  const stopScrolling = useCallback(() => {
    setScrolling(false);
  }, []);

  const startScrolling = useCallback((ref) => {
    scrollRef.current = ref.current;
    setScrolling(true);
  }, []);

  return { scrolling, startScrolling, stopScrolling };
}
