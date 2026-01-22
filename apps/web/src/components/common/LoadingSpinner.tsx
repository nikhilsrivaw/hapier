 import { cn } from '@/lib/utils';

  interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }

  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {    
    return (
      <div
        className={cn(
          'animate-spin rounded-full border-gray-200 border-t-rose-500',
          sizes[size],
          className
        )}
      />
    );
  }
