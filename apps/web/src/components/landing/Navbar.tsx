 'use client';

  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  import { motion } from 'framer-motion';
  import { Button } from '@/components/ui/button';
  import { Logo, ThemeToggle } from '@/components/common';
  import { Menu, X } from 'lucide-react';
  import { cn } from '@/lib/utils';

  const navLinks = [
      { href: '#features', label: 'Features' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#testimonials', label: 'Customers' },
  ];

  export default function Navbar() {
      const [isScrolled, setIsScrolled] = useState(false);
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      useEffect(() => {
          const handleScroll = () => {
              setIsScrolled(window.scrollY > 10);
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      return (
          <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                  'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                  isScrolled
                      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'
                      : 'bg-transparent'
              )}
          >
              <div className="max-w-7xl mx-auto px-6">
                  <div className="flex items-center justify-between h-16">
                      <div className="flex items-center gap-8">
                          <Logo />
                          <div className="hidden md:flex items-center gap-6">
                              {navLinks.map((link) => (
                                  <a
                                      key={link.href}
                                      href={link.href}
                                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900   
  dark:hover:text-white text-sm font-medium transition-colors"
                                  >
                                      {link.label}
                                  </a>
                              ))}
                          </div>
                      </div>

                      <div className="hidden md:flex items-center gap-3">
                          <ThemeToggle />
                          <Link href="/login">
                              <Button variant="ghost" className="text-gray-600 dark:text-gray-300       
  font-medium">
                                  Log In
                              </Button>
                          </Link>
                          <Link href="/register">
                              <Button className="bg-gray-900 dark:bg-white dark:text-gray-900
  hover:bg-gray-800 dark:hover:bg-gray-100 text-white font-medium rounded-full px-6">
                                  Get Started Free
                              </Button>
                          </Link>
                      </div>

                      {/* Mobile menu button */}
                      <div className="flex items-center gap-2 md:hidden">
                          <ThemeToggle />
                          <button
                              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                              className="p-2 text-gray-600 dark:text-gray-300"
                          >
                              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6"   
  />}
                          </button>
                      </div>
                  </div>

                  {/* Mobile menu */}
                  {mobileMenuOpen && (
                      <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"      
                      >
                          <div className="flex flex-col gap-4">
                              {navLinks.map((link) => (
                                  <a
                                      key={link.href}
                                      href={link.href}
                                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900   
  dark:hover:text-white font-medium"
                                      onClick={() => setMobileMenuOpen(false)}
                                  >
                                      {link.label}
                                  </a>
                              ))}
                              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200
  dark:border-gray-700">
                                  <Link href="/login">
                                      <Button variant="outline" className="w-full">Log In</Button>      
                                  </Link>
                                  <Link href="/register">
                                      <Button className="w-full bg-gray-900 dark:bg-white
  dark:text-gray-900">Get Started Free</Button>
                                  </Link>
                              </div>
                          </div>
                      </motion.div>
                  )}
              </div>
          </motion.nav>
      );
  }