 'use client';

  import { ReactNode } from 'react';
  import { ThemeProvider } from '@/components/providers/ThemeProvider';

  interface ProvidersProps {
      children: ReactNode;
  }

  export default function Providers({ children }: ProvidersProps) {
      return <ThemeProvider>{children}</ThemeProvider>;
  }