'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HomePage() {
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (circleRef.current) {
      gsap.fromTo(
        circleRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2, // Slight delay to ensure page elements are ready
        }
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-favre-bg-primary font-sans relative overflow-hidden">
      {/* Background Geometric Shape */}
      <div
        ref={circleRef}
        className="absolute bg-favre-accent rounded-full 
                   w-[500px] h-[500px] 
                   sm:w-[600px] sm:h-[600px] 
                   md:w-[700px] md:h-[700px] 
                   lg:w-[800px] lg:h-[800px] 
                   xl:w-[1000px] xl:h-[1000px] 
                   top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 z-0"
        aria-hidden="true"
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex items-center min-h-screen px-6 sm:px-10 lg:px-16 xl:px-20 py-12">
        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-favre-text-primary text-left">
            ComponentCraft AI: Where Vision Meets Code.
            <span className="block text-favre-primary mt-1 sm:mt-2">Instantly.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-favre-neutral-dark text-left text-balance">
            Transform your UI descriptions into interactive prototypes with the power of AI. Effortless design, elegant results.
          </p>
          <div className="mt-10 text-left">
            <Link
              href="/generator"
              className="inline-block px-10 py-4 bg-favre-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-favre-primary focus:ring-opacity-75 motion-safe:transition-all duration-150 ease-in-out transform hover:scale-105"
            >
              Launch Generator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
