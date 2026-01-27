  'use client';                                                                                         
                                                                                                        
  import Link from 'next/link';
  import { usePathname, useRouter } from 'next/navigation';
  import {
      Briefcase,
      Users,
      Video,
      LayoutDashboard,
      ArrowLeft,
  } from 'lucide-react';
  import { ThemeToggle } from '@/components/common';
  import { Button } from '@/components/ui/button';
  import { cn } from '@/lib/utils';

  const navItems = [
      { label: 'Overview', href: '/recruitment', icon: LayoutDashboard },
      { label: 'Jobs', href: '/recruitment/jobs', icon: Briefcase },
      { label: 'Candidates', href: '/recruitment/candidates', icon: Users },
      { label: 'Interviews', href: '/recruitment/interviews', icon: Video },
  ];

  export default function RecruitmentLayout({ children }: { children: React.ReactNode }) {
      const pathname = usePathname();
      const router = useRouter();

      const isActive = (href: string) => {
          if (href === '/recruitment') return pathname === href;
          return pathname.startsWith(href);
      };

      return (
          <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
              {/* Navbar */}
              <header className="sticky top-0 z-50 bg-white dark:bg-[#111] border-b border-gray-200   dark:border-gray-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                      {/* Top row */}
                      <div className="flex items-center justify-between h-14">
                          <div className="flex items-center gap-4">
                              <button
                                  onClick={() => router.push('/dashboard')}
                                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800  
  transition-colors"
                              >
                                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                              </button>
                              <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500  
  to-purple-600 flex items-center justify-center">
                                      <Briefcase className="w-4 h-4 text-white" />
                                  </div>
                                  <h1 className="font-semibold text-gray-900
  dark:text-white">Recruitment</h1>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <ThemeToggle />
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push('/dashboard')}
                                  className="hidden sm:flex"
                              >
                                  HR Dashboard
                              </Button>
                          </div>
                      </div>

                      {/* Navigation tabs */}
                      <nav className="flex items-center gap-1 -mb-px">
                          {navItems.map((item) => (
                              <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2  transition-colors",
                                      isActive(item.href)
                                          ? "border-violet-600 text-violet-600 dark:text-violet-400"    
                                          : "border-transparent text-gray-500 hover:text-gray-700    dark:text-gray-400 dark:hover:text-gray-200"
                                  )}
                              >
                                  <item.icon className="w-4 h-4" />
                                  <span className="hidden sm:inline">{item.label}</span>
                              </Link>
                          ))}
                      </nav>
                  </div>
              </header>

              {/* Main Content */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                  {children}
              </main>
          </div>
      );
  }
