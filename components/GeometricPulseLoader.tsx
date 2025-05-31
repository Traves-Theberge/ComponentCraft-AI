'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GeometricPulseLoader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (circlesRef.current.length === 3) {
      gsap.to(circlesRef.current, {
        scale: 0.7,
        opacity: 0.5,
        duration: 0.6,
        ease: 'power1.inOut',
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
      });
    }
    // Cleanup function to kill animation when component unmounts
    return () => {
      if (circlesRef.current.length === 3) {
        gsap.killTweensOf(circlesRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex items-center justify-center space-x-2 h-full w-full"
      aria-label="Loading content..."
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) circlesRef.current[index] = el;
          }}
          className="w-3 h-3 bg-favre-primary rounded-full"
          style={{ opacity: 1, transform: 'scale(1)' }} // Initial state before GSAP takes over
        ></div>
      ))}
    </div>
  );
};

export default GeometricPulseLoader;
