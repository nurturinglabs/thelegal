import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-surfaceLight';

  const variantStyles = {
    text: 'rounded h-4',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const skeletonElement = (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{
        width: width || (variant === 'text' ? '100%' : '100px'),
        height: height || (variant === 'circular' ? '100px' : '100%'),
      }}
      {...props}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonElement}</div>
      ))}
    </div>
  );
}
