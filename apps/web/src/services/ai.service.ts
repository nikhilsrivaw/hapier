 import api from '@/lib/api';
                                                                                                        
  export const aiService = {
      // Chat assistant
      async chat(message: string): Promise<{ response: string }> {
          return api.post('/ai/chat', { message });
      },

      // Resume parser
      async parseResume(resumeText: string): Promise<{
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
          designation?: string;
          skills?: string[];
          experience?: string;
          education?: string;
      }> {
          return api.post('/ai/parse-resume', { resumeText });
      },

      // AI Insights
      async getInsights(): Promise<{
          summary: string;
          attendanceInsight: string;
          leaveInsight: string;
          taskInsight: string;
          recommendations: string[];
      }> {
          return api.get('/ai/insights');
      },

      // Intelligent search
      async search(query: string): Promise<{
          type: string;
          results: any[];
          explanation: string;
      }> {
          return api.post('/ai/search', { query });
      },

      // Smart task assignment
      async suggestAssignee(taskTitle: string, taskDescription?: string, projectId?: string): Promise<{ 
          suggestedEmployeeId: string | null;
          suggestedEmployee: any;
          reason: string;
          alternatives: any[];
      }> {
          return api.post('/ai/suggest-assignee', { taskTitle, taskDescription, projectId });
      },

      // Report generator
      async generateReport(
          reportType: 'attendance' | 'leave' | 'task' | 'employee',
          dateRange: { start: string; end: string }
      ): Promise<{
          title: string;
          summary: string;
          data: any;
          insights: string[];
      }> {
          return api.post('/ai/generate-report', { reportType, dateRange });
      }
  };
