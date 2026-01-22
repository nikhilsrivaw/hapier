 import Link from 'next/link';
  import { cn } from '@/lib/utils';

  interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
  }

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  export default function Logo({ size = 'md', showText = true, className }: LogoProps) {       
    return (
      <Link href="/" className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20',
            sizes[size]
          )}
        >
          <span className="text-white font-bold">H</span>
        </div>
        {showText && (
          <span className={cn('font-bold text-gray-900', textSizes[size])}>
            Hapier
          </span>
        )}
      </Link>
    );
  }