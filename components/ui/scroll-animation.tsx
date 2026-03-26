'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'fade-in-up' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  className?: string;
}

const animationClasses = {
  'fade-in': 'animate-fade-in',
  'fade-in-up': 'animate-fade-in-up',
  'slide-in-left': 'animate-slide-in-left',
  'slide-in-right': 'animate-slide-in-right',
  'scale-in': 'animate-scale-in',
};

export function ScrollAnimation({
  children,
  animation = 'fade-in-up',
  delay = 0,
  className = '',
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const animationClass = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={`${isVisible ? animationClass : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}
