 'use client';

  import { useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Sparkles, Loader2, User, Check } from 'lucide-react';
  import { aiService } from '@/services/ai.service';

  interface AssigneeSuggestionProps {
      taskTitle: string;
      taskDescription?: string;
      projectId?: string;
      onSelect: (employeeId: string) => void;
  }

  export default function AssigneeSuggestion({
      taskTitle,
      taskDescription,
      projectId,
      onSelect
  }: AssigneeSuggestionProps) {
      const [isLoading, setIsLoading] = useState(false);
      const [suggestion, setSuggestion] = useState<{
          suggestedEmployeeId: string | null;
          suggestedEmployee: any;
          reason: string;
          alternatives: any[];
      } | null>(null);
      const [error, setError] = useState<string | null>(null);

      const getSuggestion = async () => {
          if (!taskTitle.trim()) {
              setError('Enter a task title first');
              return;
          }

          setIsLoading(true);
          setError(null);
          setSuggestion(null);

          try {
              const result = await aiService.suggestAssignee(taskTitle, taskDescription, projectId);    
              setSuggestion(result);
          } catch (err: any) {
              setError(err.message || 'Failed to get suggestion');
          } finally {
              setIsLoading(false);
          }
      };

      const handleSelect = (employeeId: string) => {
          onSelect(employeeId);
          setSuggestion(null);
      };

      return (
          <div className="mt-2">
              <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getSuggestion}
                  disabled={isLoading}
                  className="w-full h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50    
  dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950"
              >
                  {isLoading ? (
                      <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Finding...
                      </>
                  ) : (
                      <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Suggest
                      </>
                  )}
              </Button>

              {error && (
                  <p className="text-xs text-red-500 mt-1">{error}</p>
              )}

              {suggestion && suggestion.suggestedEmployee && (
                  <div className="mt-2 bg-purple-50 dark:bg-purple-950/50 rounded-md p-2 space-y-2      
  max-h-40 overflow-y-auto">
                      {/* Main Suggestion */}
                      <div
                          className="flex items-center justify-between bg-white dark:bg-gray-900 rounded
   p-2 cursor-pointer hover:ring-1 hover:ring-purple-500 transition-all"
                          onClick={() => handleSelect(suggestion.suggestedEmployeeId!)}
                      >
                          <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex
   items-center justify-center">
                                  <User className="w-3 h-3 text-purple-600 dark:text-purple-400" />     
                              </div>
                              <div>
                                  <p className="text-xs font-medium text-gray-900 dark:text-white">     
                                      {suggestion.suggestedEmployee.firstName}
  {suggestion.suggestedEmployee.lastName}
                                  </p>
                              </div>
                          </div>
                          <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-700    
  dark:text-green-300 px-1.5 py-0.5 rounded">
                              Best
                          </span>
                      </div>

                      {/* Reason */}
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                          {suggestion.reason}
                      </p>

                      {/* Alternatives - inline */}
                      {suggestion.alternatives && suggestion.alternatives.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                              {suggestion.alternatives.slice(0, 2).map((alt: any) => (
                                  <button
                                      key={alt.id}
                                      type="button"
                                      onClick={() => handleSelect(alt.id)}
                                      className="flex items-center gap-1 bg-white dark:bg-gray-900      
  rounded px-2 py-1 text-[10px] hover:ring-1 hover:ring-purple-300"
                                  >
                                      <User className="w-3 h-3 text-gray-400" />
                                      {alt.firstName}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  }
