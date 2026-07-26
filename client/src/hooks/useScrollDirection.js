import { useEffect, useRef, useState } from 'react';

/**
 * Returns true when navbar should be visible.
 * Hides on scroll down, shows on scroll up.
 * More forgiving threshold for better mobile experience.
 */
export default function useScrollDirection(threshold = 100) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;

      // Always show when near top
      if (currentY <= 50) {
        setVisible(true);
      } else if (currentY > lastScrollY.current && currentY > threshold) {
        // Hide only when scrolling down significantly
        setVisible(false);
      } else if (currentY < lastScrollY.current - 10) {
        // Show when scrolling up even a little bit
        setVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return visible;
}
