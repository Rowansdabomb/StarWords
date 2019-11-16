import {
  useEffect, useState, useCallback, useRef,
} from 'react';

const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

export default function useActivityDetect(maxInactiveSeconds) {
  const secondsSinceLastActivity = useRef(0);
  const [inactive, setInactive] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      secondsSinceLastActivity.current += 1;
      if (secondsSinceLastActivity.current > maxInactiveSeconds) {
        setInactive(true);
      }
    }, 1000);

    activityEvents.forEach((eventType) => {
      document.addEventListener(eventType, () => {
        setInactive(false);
        secondsSinceLastActivity.current = 0;
      });
    });

    return () => clearInterval(intervalId);
  }, [maxInactiveSeconds]);

  const getSecondsSinceLastActivity = useCallback(() => secondsSinceLastActivity.current, []);

  return { getSecondsSinceLastActivity, inactive };
}
