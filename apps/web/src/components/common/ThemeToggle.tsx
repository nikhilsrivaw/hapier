 'use client';

  import { useTheme } from 'next-themes';
  import { useEffect, useState } from 'react';
  import { motion } from 'framer-motion';
  import { Sun, Moon, Monitor } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';

  export function ThemeToggle() {
      const { theme, setTheme } = useTheme();
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
          setMounted(true);
      }, []);

      if (!mounted) {
          return (
              <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Sun className="w-5 h-5" />
              </Button>
          );
      }

      return (
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9 relative">
                      <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90
  dark:scale-0" />
                      <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0  
  dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
                      <Monitor className="w-4 h-4" />
                      System
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
      );
  }
