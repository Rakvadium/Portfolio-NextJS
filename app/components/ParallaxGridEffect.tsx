'use client';

import { useEffect } from 'react';

export default function ParallaxGridEffect() {
  useEffect(() => {
    const handleScroll = () => {
      // Calculate the desired background position (e.g., half the scroll speed)
      const scrollY = window.scrollY;
      const backgroundPositionY = scrollY * 0.5; // Adjust 0.5 for speed (0 = fixed, 1 = normal scroll)

      // Apply the style to the body element
      document.body.style.backgroundPositionY = `${backgroundPositionY}px`;
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set position
    handleScroll();

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Optional: Reset background position on unmount
      // document.body.style.backgroundPositionY = '0px';
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // This component doesn't render anything itself
  return null;
} 