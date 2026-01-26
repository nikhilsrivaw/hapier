 'use client';                                                                                         
  
  import { useState, useEffect } from 'react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Brain, TrendingUp, Calendar, CheckSquare, RefreshCw, Sparkles, AlertCircle } from
  'lucide-react';
  import { aiService } from '@/services/ai.service';

  interface Insights {
      summary: string;
      attendanceInsight: string;
      leaveInsight: string;
      taskInsight: string;
      recommendations: string[];
  }

  export default function AIInsights() {
      const [insights, setInsights] = useState<Insights | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchInsights = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const data = await aiService.getInsights();
              setInsights(data);
          } catch (err: any) {
              setError(err.message || 'Failed to load insights');
          } finally {
              setIsLoading(false);
          }
      };

      useEffect(() => {
          fetchInsights();
      }, []);

      if (isLoading) {
          return (
              <Card className="col-span-full">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          AI Insights
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center justify-center py-12">
                          <div className="flex items-center gap-3 text-gray-500">
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Generating insights...</span>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          );
      }

      if (error) {
          return (
              <Card className="col-span-full">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          AI Insights
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex flex-col items-center justify-center py-8 gap-4">
                          <AlertCircle className="w-10 h-10 text-red-500" />
                          <p className="text-gray-500">{error}</p>
                          <Button variant="outline" onClick={fetchInsights}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Retry
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          );
      }

      return (
          <Card className="col-span-full bg-gradient-to-br from-purple-50 to-blue-50
  dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Insights
                      <span className="text-xs font-normal bg-purple-100 dark:bg-purple-900
  text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          Powered by AI
                      </span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={fetchInsights}>
                      <RefreshCw className="w-4 h-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">{insights?.summary}</p>       
                      </div>
                  </div>

                  {/* Insight Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Attendance</h4> 
                          </div>
                          <p className="text-sm text-gray-600
  dark:text-gray-400">{insights?.attendanceInsight}</p>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Leaves</h4>     
                          </div>
                          <p className="text-sm text-gray-600
  dark:text-gray-400">{insights?.leaveInsight}</p>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                              <CheckSquare className="w-4 h-4 text-orange-600" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Tasks</h4>      
                          </div>
                          <p className="text-sm text-gray-600
  dark:text-gray-400">{insights?.taskInsight}</p>
                      </div>
                  </div>

                  {/* Recommendations */}
                  {insights?.recommendations && insights.recommendations.length > 0 && (
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                          <h4 className="font-medium text-gray-900 dark:text-white
  mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                              {insights.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm
  text-gray-600 dark:text-gray-400">
                                      <span className="w-5 h-5 bg-purple-100 dark:bg-purple-900
  text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center flex-shrink-0      
  text-xs">
                                          {index + 1}
                                      </span>
                                      {rec}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
              </CardContent>
          </Card>
      );
  }