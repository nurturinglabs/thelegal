'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animation?: 'fade-in' | 'slide-up' | 'slide-in-right' | 'scale-in';
}

export default function AnimatedList({
  children,
  className,
  itemClassName,
  staggerDelay = 50,
  animation = 'slide-up',
}: AnimatedListProps) {
  const animationClass = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  };

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(animationClass[animation], itemClassName)}
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
