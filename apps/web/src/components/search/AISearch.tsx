'use client';                                                                                            
  import { useState, useRef, useEffect } from 'react';                                                  
  import { Search, Sparkles, X, Loader2, User, CheckSquare, Calendar, FolderKanban } from
  'lucide-react';
  import { Input } from '@/components/ui/input';
  import { aiService } from '@/services/ai.service';
  import { useRouter } from 'next/navigation';
  import { motion, AnimatePresence } from 'framer-motion';

  export default function AISearch() {
      const [query, setQuery] = useState('');
      const [isOpen, setIsOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [results, setResults] = useState<{
          type: string;
          results: any[];
          explanation: string;
      } | null>(null);
      const inputRef = useRef<HTMLInputElement>(null);
      const containerRef = useRef<HTMLDivElement>(null);
      const router = useRouter();

      // Close on outside click
      useEffect(() => {
          const handleClickOutside = (e: MouseEvent) => {
              if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                  setIsOpen(false);
              }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      const handleSearch = async () => {
          if (!query.trim()) return;

          setIsLoading(true);
          setIsOpen(true);

          try {
              const data = await aiService.search(query);
              setResults(data);
          } catch (err) {
              setResults({ type: 'error', results: [], explanation: 'Search failed' });
          } finally {
              setIsLoading(false);
          }
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
              handleSearch();
          }
          if (e.key === 'Escape') {
              setIsOpen(false);
          }
      };

      const getIcon = (type: string) => {
          switch (type) {
              case 'employees': return <User className="w-4 h-4" />;
              case 'tasks': return <CheckSquare className="w-4 h-4" />;
              case 'leaves': return <Calendar className="w-4 h-4" />;
              case 'projects': return <FolderKanban className="w-4 h-4" />;
              default: return <Search className="w-4 h-4" />;
          }
      };

      const handleResultClick = (type: string, item: any) => {
          setIsOpen(false);
          setQuery('');

          switch (type) {
              case 'employees':
                  router.push(`/employees/${item.id}`);
                  break;
              case 'tasks':
                  router.push('/tasks');
                  break;
              case 'leaves':
                  router.push('/leaves');
                  break;
              case 'projects':
                  router.push(`/projects/${item.id}`);
                  break;
          }
      };

      const getResultTitle = (type: string, item: any) => {
          switch (type) {
              case 'employees':
                  return `${item.firstName} ${item.lastName}`;
              case 'tasks':
                  return item.title;
              case 'leaves':
                  return `${item.employee?.firstName} - ${item.leaveType?.name || 'Leave'}`;
              case 'projects':
                  return item.name;
              default:
                  return 'Unknown';
          }
      };

      const getResultSubtitle = (type: string, item: any) => {
          switch (type) {
              case 'employees':
                  return item.designation || item.department?.name || 'Employee';
              case 'tasks':
                  return `${item.status} • ${item.priority}`;
              case 'leaves':
                  return item.status;
              case 'projects':
                  return item.status;
              default:
                  return '';
          }
      };

      return (
          <div ref={containerRef} className="relative w-full max-w-md">
              {/* Search Input */}
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> 
                  <Input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => results && setIsOpen(true)}
                      placeholder="AI Search... try 'employees on leave'"
                      className="pl-10 pr-20 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200
  dark:border-gray-700"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">   
                      {query && (
                          <button
                              onClick={() => { setQuery(''); setResults(null); setIsOpen(false); }}     
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                              <X className="w-3 h-3 text-gray-400" />
                          </button>
                      )}
                      <button
                          onClick={handleSearch}
                          disabled={isLoading || !query.trim()}
                          className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 
  text-purple-700 dark:text-purple-300 rounded text-xs font-medium hover:bg-purple-200
  dark:hover:bg-purple-800 disabled:opacity-50"
                      >
                          {isLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                              <Sparkles className="w-3 h-3" />
                          )}
                      </button>
                  </div>
              </div>

              {/* Results Dropdown */}
              <AnimatePresence>
                  {isOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900    
  rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                          {isLoading ? (
                              <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                                  <span className="ml-2 text-sm text-gray-500">Searching...</span>      
                              </div>
                          ) : results ? (
                              <div>
                                  {/* Explanation */}
                                  <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border-b 
  border-gray-200 dark:border-gray-700">
                                      <p className="text-xs text-purple-700 dark:text-purple-300 flex   
  items-center gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          {results.explanation}
                                      </p>
                                  </div>

                                  {/* Results List */}
                                  {results.results.length > 0 ? (
                                      <div className="max-h-64 overflow-y-auto">
                                          {results.results.map((item, index) => (
                                              <div
                                                  key={item.id || index}
                                                  onClick={() => handleResultClick(results.type, item)} 
                                                  className="flex items-center gap-3 px-4 py-3
  hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800  
  last:border-0"
                                              >
                                                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800  
  rounded-full flex items-center justify-center text-gray-500">
                                                      {getIcon(results.type)}
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-medium text-gray-900   
  dark:text-white truncate">
                                                          {getResultTitle(results.type, item)}
                                                      </p>
                                                      <p className="text-xs text-gray-500 truncate">    
                                                          {getResultSubtitle(results.type, item)}       
                                                      </p>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="py-8 text-center text-gray-500 text-sm">
                                          No results found
                                      </div>
                                  )}
                              </div>
                          ) : null}
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
      );
  }