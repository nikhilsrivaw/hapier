'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { motion, AnimatePresence } from 'framer-motion';
  import { Bell, Search, LogOut, User, ChevronDown, Menu } from 'lucide-react';
  import { useAuthStore } from '@/store/auth';
  import { ROUTES } from '@/config/constants';
  import { Logo, ThemeToggle } from '@/components/common';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  interface NavbarProps {
      onMenuClick: () => void;
  }

  export default function Navbar({ onMenuClick }: NavbarProps) {
      const router = useRouter();
      const { user, organization, logout } = useAuthStore();
      const [showUserMenu, setShowUserMenu] = useState(false);

      const handleLogout = () => {
          logout();
          router.push(ROUTES.LOGIN);
      };

      return (
          <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b
  border-gray-200 dark:border-gray-800 z-50">
              <div className="flex items-center justify-between h-full px-4">
                  {/* Left */}
                  <div className="flex items-center gap-4">
                      <button
                          onClick={onMenuClick}
                          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg  
  text-gray-600 dark:text-gray-300"
                      >
                          <Menu className="h-5 w-5" />
                      </button>
                      <Logo />
                  </div>

                  {/* Center - Search */}
                  <div className="hidden md:flex flex-1 max-w-md mx-8">
                      <div className="relative w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
  text-gray-400" />
                          <Input
                              type="text"
                              placeholder="Search employees, departments..."
                              className="w-full pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200       
  dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800"
                          />
                      </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2">
                      {/* Theme Toggle */}
                      <ThemeToggle />

                      {/* Notifications */}
                      <Button variant="ghost" size="icon" className="relative text-gray-600
  dark:text-gray-300">
                          <Bell className="h-5 w-5" />
                          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />  
                      </Button>

                      {/* User Menu */}
                      <div className="relative">
                          <button
                              onClick={() => setShowUserMenu(!showUserMenu)}
                              className="flex items-center gap-2 p-2 hover:bg-gray-100
  dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500     
  rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                      {user?.email?.charAt(0).toUpperCase()}
                                  </span>
                              </div>
                              <div className="hidden sm:block text-left">
                                  <p className="text-sm font-medium text-gray-700
  dark:text-gray-200">{organization?.name}</p>
                                  <p className="text-xs text-gray-500
  dark:text-gray-400">{user?.role}</p>
                              </div>
                              <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                          </button>

                          <AnimatePresence>
                              {showUserMenu && (
                                  <>
                                      <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setShowUserMenu(false)}
                                      />
                                      <motion.div
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute right-0 mt-2 w-56 bg-white
  dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden     
  z-50"
                                      >
                                          <div className="p-3 border-b border-gray-100
  dark:border-gray-700">
                                              <p className="font-medium text-gray-900
  dark:text-white">{user?.email}</p>
                                              <p className="text-sm text-gray-500
  dark:text-gray-400">{user?.role}</p>
                                          </div>
                                          <div className="p-2">
                                              <button
                                                  onClick={() => {
                                                      setShowUserMenu(false);
                                                      router.push(ROUTES.SETTINGS);
                                                  }}
                                                  className="w-full flex items-center gap-2 px-3 py-2   
  text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors 
  text-left"
                                              >
                                                  <User className="h-4 w-4" />
                                                  Profile Settings
                                              </button>
                                              <button
                                                  onClick={handleLogout}
                                                  className="w-full flex items-center gap-2 px-3 py-2   
  text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors  
  text-left"
                                              >
                                                  <LogOut className="h-4 w-4" />
                                                  Sign Out
                                              </button>
                                          </div>
                                      </motion.div>
                                  </>
                              )}
                          </AnimatePresence>
                      </div>
                  </div>
              </div>
          </header>
      );
  }