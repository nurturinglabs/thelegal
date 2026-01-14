import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const colorStyles = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
