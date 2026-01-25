 import Link from 'next/link';                                                                        import Image from 'next/image';
  import { cn } from '@/lib/utils';                                                                  
  
  interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
  }

  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
    const { icon, text } = sizes[size];

    return (
      <Link href="/" className={cn('flex items-center gap-2', className)}>
        <Image
          src="/logo.svg"
          alt="Hapier"
          width={icon}
          height={icon}
          className="shadow-lg shadow-rose-500/20 rounded-xl"
        />
        {showText && (
          <span className={cn('font-bold text-gray-900', text)}>
            Hapier
          </span>
        )}
      </Link>
    );
  }
