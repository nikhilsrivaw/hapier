'use client';

  import { useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from
  '@/components/ui/select';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Sparkles, Loader2, FileText, Download, BarChart3, Users, Calendar, CheckSquare } from        
  'lucide-react';
  import { aiService } from '@/services/ai.service';

  interface ReportData {
      title: string;
      summary: string;
      data: any;
      insights: string[];
  }

  export default function AIReportGenerator() {
      const [reportType, setReportType] = useState<'attendance' | 'leave' | 'task' |
  'employee'>('attendance');
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [report, setReport] = useState<ReportData | null>(null);
      const [error, setError] = useState<string | null>(null);

      const handleGenerate = async () => {
          if (!startDate || !endDate) {
              setError('Please select date range');
              return;
          }

          setIsLoading(true);
          setError(null);
          setReport(null);

          try {
              const data = await aiService.generateReport(reportType, { start: startDate, end: endDate  
  });
              setReport(data);
          } catch (err: any) {
              setError(err.message || 'Failed to generate report');
          } finally {
              setIsLoading(false);
          }
      };

      const getReportIcon = () => {
          switch (reportType) {
              case 'attendance': return <BarChart3 className="w-5 h-5" />;
              case 'leave': return <Calendar className="w-5 h-5" />;
              case 'task': return <CheckSquare className="w-5 h-5" />;
              case 'employee': return <Users className="w-5 h-5" />;
          }
      };

      const renderDataCards = () => {
          if (!report?.data) return null;

          const data = report.data;
          let cards: { label: string; value: number | string; color: string }[] = [];

          switch (reportType) {
              case 'attendance':
                  cards = [
                      { label: 'Total Records', value: data.total || 0, color: 'bg-blue-500' },
                      { label: 'Present', value: data.present || 0, color: 'bg-green-500' },
                      { label: 'Absent', value: data.absent || 0, color: 'bg-red-500' },
                      { label: 'Late', value: data.late || 0, color: 'bg-yellow-500' },
                      { label: 'Half Day', value: data.halfDay || 0, color: 'bg-orange-500' },
                  ];
                  break;
              case 'leave':
                  cards = [
                      { label: 'Total Requests', value: data.total || 0, color: 'bg-blue-500' },        
                      { label: 'Approved', value: data.approved || 0, color: 'bg-green-500' },
                      { label: 'Pending', value: data.pending || 0, color: 'bg-yellow-500' },
                      { label: 'Rejected', value: data.rejected || 0, color: 'bg-red-500' },
                  ];
                  break;
              case 'task':
                  cards = [
                      { label: 'Total Tasks', value: data.total || 0, color: 'bg-blue-500' },
                      { label: 'Completed', value: data.completed || 0, color: 'bg-green-500' },        
                      { label: 'In Progress', value: data.inProgress || 0, color: 'bg-yellow-500' },    
                      { label: 'To Do', value: data.todo || 0, color: 'bg-gray-500' },
                      { label: 'High Priority', value: data.highPriority || 0, color: 'bg-red-500' },   
                  ];
                  break;
              case 'employee':
                  cards = [
                      { label: 'Total', value: data.total || 0, color: 'bg-blue-500' },
                      { label: 'Active', value: data.active || 0, color: 'bg-green-500' },
                      { label: 'On Leave', value: data.onLeave || 0, color: 'bg-yellow-500' },
                      { label: 'On Notice', value: data.onNotice || 0, color: 'bg-orange-500' },        
                  ];
                  break;
          }

          return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {cards.map((card, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border
  border-gray-200 dark:border-gray-700">
                          <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center
  justify-center mb-2`}>
                              <span className="text-white text-sm font-bold">{typeof card.value ===     
  'number' && card.value > 99 ? '99+' : card.value}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>      
                      </div>
                  ))}
              </div>
          );
      };

      const handleExport = () => {
          if (!report) return;

          const content = `
  ${report.title}
  Generated: ${new Date().toLocaleDateString()}
  Date Range: ${startDate} to ${endDate}

  SUMMARY
  ${report.summary}

  DATA
  ${JSON.stringify(report.data, null, 2)}

  AI INSIGHTS
  ${report.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
          `.trim();

          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${reportType}-report-${startDate}-to-${endDate}.txt`;
          a.click();
          URL.revokeObjectURL(url);
      };

      return (
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30
  dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      AI Report Generator
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  {/* Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                          <Label>Report Type</Label>
                          <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>      
                              <SelectTrigger>
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="attendance">Attendance Report</SelectItem>
                                  <SelectItem value="leave">Leave Report</SelectItem>
                                  <SelectItem value="task">Task Report</SelectItem>
                                  <SelectItem value="employee">Employee Report</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                          />
                      </div>
                      <div className="flex items-end">
                          <Button
                              onClick={handleGenerate}
                              disabled={isLoading}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                              {isLoading ? (
                                  <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Generating...
                                  </>
                              ) : (
                                  <>
                                      <Sparkles className="w-4 h-4 mr-2" />
                                      Generate
                                  </>
                              )}
                          </Button>
                      </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  {/* Report Output */}
                  {report && (
                      <div className="space-y-4 bg-white dark:bg-gray-900 rounded-xl p-4 border
  border-gray-200 dark:border-gray-700">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg 
  flex items-center justify-center text-purple-600 dark:text-purple-400">
                                      {getReportIcon()}
                                  </div>
                                  <div>
                                      <h3 className="font-semibold text-gray-900
  dark:text-white">{report.title}</h3>
                                      <p className="text-xs text-gray-500">{startDate} to {endDate}</p> 
                                  </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={handleExport}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                              </Button>
                          </div>

                          {/* Summary */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                              <p className="text-sm text-gray-700
  dark:text-gray-300">{report.summary}</p>
                          </div>

                          {/* Data Cards */}
                          {renderDataCards()}

                          {/* AI Insights */}
                          {report.insights && report.insights.length > 0 && (
                              <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white flex
  items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-purple-600" />
                                      AI Insights
                                  </h4>
                                  <ul className="space-y-2">
                                      {report.insights.map((insight, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm
  text-gray-600 dark:text-gray-400">
                                              <span className="w-5 h-5 bg-purple-100 dark:bg-purple-900 
  text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center flex-shrink-0      
  text-xs">
                                                  {i + 1}
                                              </span>
                                              {insight}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  )}
              </CardContent>
          </Card>
      );
  }