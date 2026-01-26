import OpenAI from 'openai';
import  prisma  from '../../lib/prisma';

export class AIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    // ==================== CHAT ASSISTANT ====================
    async processChat(message: string, userId: string, orgId: string): Promise<string> {
        const employee = await prisma.employee.findFirst({
            where: { userId, organizationId: orgId },
            include: { department: true }
        });

        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                employeeId: employee?.id,
                startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
            }
        });

        const approvedLeaves = leaveRequests.filter(l => l.status === 'APPROVED').length;
        const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING').length;

        const systemPrompt = `You are Hapier AI, a helpful HR assistant.
  Employee: ${employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'}
  Department: ${employee?.department?.name || 'Not assigned'}
  Designation: ${employee?.designation || 'Not set'}
  Leaves this year - Approved: ${approvedLeaves}, Pending: ${pendingLeaves}

  Help with HR queries. Be concise and helpful. For specific data you don't have, suggest contacting    
  HR.`;

        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 500,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ]
        });

        return response.choices[0]?.message?.content || 'Sorry, I could not process that.';
    }

    // ==================== RESUME PARSER ====================
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
        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 1000,
            messages: [
                {
                    role: 'system',
                    content: `Extract employee information from the resume. Return ONLY valid JSON    
  with these fields:
  {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "designation": "string (job title/role)",
      "skills": ["array of skills"],
      "experience": "string (summary of work experience)",
      "education": "string (highest education)"
  }
  If a field is not found, omit it. Return ONLY the JSON object, no other text.`
                },
                { role: 'user', content: resumeText }
            ]
        });

        const content = response.choices[0]?.message?.content || '{}';
        try {
            return JSON.parse(content);
        } catch {
            return {};
        }
    }

    // ==================== AI INSIGHTS ====================
    async generateInsights(orgId: string): Promise<{
        summary: string;
        attendanceInsight: string;
        leaveInsight: string;
        taskInsight: string;
        recommendations: string[];
    }> {
        // Gather organization data
        const [employees, attendance, leaves, tasks] = await Promise.all([
            prisma.employee.findMany({
                where: { organizationId: orgId },
                include: { department: true }
            }),
            prisma.attendance.findMany({
                where: {
                    employee: { organizationId: orgId },
                    date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            }),
            prisma.leaveRequest.findMany({
                where: {
                    employee: { organizationId: orgId },
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            }),
            prisma.task.findMany({
                where: { organizationId: orgId }
            })
        ]);

        const stats = {
            totalEmployees: employees.length,
            activeEmployees: employees.filter(e => e.status === 'ACTIVE').length,
            avgAttendance: attendance.length > 0
                ? (attendance.filter(a => a.status === 'PRESENT').length / attendance.length *
                    100).toFixed(1)
                : 0,
            pendingLeaves: leaves.filter(l => l.status === 'PENDING').length,
            approvedLeaves: leaves.filter(l => l.status === 'APPROVED').length,
            tasksCompleted: tasks.filter(t => t.status === 'DONE').length,
            tasksPending: tasks.filter(t => t.status !== 'DONE').length,
            highPriorityTasks: tasks.filter(t => t.priority === 'HIGH' || t.priority ===
                'URGENT').length
        };

        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 1000,
            messages: [
                {
                    role: 'system',
                    content: `You are an HR analytics AI. Analyze the data and provide insights.      
  Return ONLY valid JSON:
  {
      "summary": "Brief overall health summary (2-3 sentences)",
      "attendanceInsight": "Insight about attendance patterns",
      "leaveInsight": "Insight about leave trends",
      "taskInsight": "Insight about task/productivity",
      "recommendations": ["3-4 actionable recommendations"]
  }`
                },
                {
                    role: 'user',
                    content: `Organization Stats (Last 30 days):
  - Total Employees: ${stats.totalEmployees}
  - Active Employees: ${stats.activeEmployees}
  - Average Attendance Rate: ${stats.avgAttendance}%
  - Pending Leave Requests: ${stats.pendingLeaves}
  - Approved Leaves: ${stats.approvedLeaves}
  - Tasks Completed: ${stats.tasksCompleted}
  - Tasks Pending: ${stats.tasksPending}
  - High Priority Tasks: ${stats.highPriorityTasks}`
                }
            ]
        });

        try {
            return JSON.parse(response.choices[0]?.message?.content || '{}');
        } catch {
            return {
                summary: 'Unable to generate insights',
                attendanceInsight: '',
                leaveInsight: '',
                taskInsight: '',
                recommendations: []
            };
        }
    }

    // ==================== INTELLIGENT SEARCH ====================
    async intelligentSearch(query: string, orgId: string): Promise<{
        type: string;
        results: any[];
        explanation: string;
    }> {
        // First, understand the query intent
        const intentResponse = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 200,
            messages: [
                {
                    role: 'system',
                    content: `Analyze the search query and return JSON:
  {
      "type": "employees" | "tasks" | "leaves" | "attendance" | "projects",
      "filters": {
          "department": "string or null",
          "status": "string or null",
          "name": "string or null",
          "dateRange": "string or null"
      }
  }
  Only return valid JSON.`
                },
                { role: 'user', content: query }
            ]
        });

        let intent;
        try {
            intent = JSON.parse(intentResponse.choices[0]?.message?.content || '{}');
        } catch {
            intent = { type: 'employees', filters: {} };
        }

        let results: any[] = [];

        // Execute search based on intent
        switch (intent.type) {
            case 'employees':
                results = await prisma.employee.findMany({
                    where: {
                        organizationId: orgId,
                        ...(intent.filters.name && {
                            OR: [
                                { firstName: { contains: intent.filters.name, mode: 'insensitive' } },
                                { lastName: { contains: intent.filters.name, mode: 'insensitive' } }
                            ]
                        }),
                        ...(intent.filters.status && { status: intent.filters.status })
                    },
                    include: { department: true },
                    take: 10
                });
                break;

            case 'tasks':
                results = await prisma.task.findMany({
                    where: {
                        organizationId: orgId,
                        ...(intent.filters.status && { status: intent.filters.status })
                    },
                    include: { assignee: true, project: true },
                    take: 10
                });
                break;

            case 'leaves':
                results = await prisma.leaveRequest.findMany({
                    where: {
                        employee: { organizationId: orgId },
                        ...(intent.filters.status && { status: intent.filters.status })
                    },
                    include: { employee: true, leaveType: true },
                    take: 10
                });
                break;

            case 'projects':
                results = await prisma.project.findMany({
                    where: {
                        organizationId: orgId,
                        ...(intent.filters.status && { status: intent.filters.status })
                    },
                    include: { owner: true },
                    take: 10
                });
                break;
        }

        return {
            type: intent.type,
            results,
            explanation: `Found ${results.length} ${intent.type} matching your query.`
        };
    }

    // ==================== SMART TASK ASSIGNMENT ====================
    async suggestAssignee(
        taskTitle: string,
        taskDescription: string,
        projectId: string | null,
        orgId: string
    ): Promise<{
        suggestedEmployeeId: string | null;
        suggestedEmployee: any;
        reason: string;
        alternatives: any[];
    }> {
        // Get all active employees with their current workload
        const employees = await prisma.employee.findMany({
            where: {
                organizationId: orgId,
                status: 'ACTIVE'
            },
            include: {
                department: true,
                assignedTasks: {
                    where: { status: { not: 'DONE' } }
                }
            }
        });

        // Get project info if provided
        let projectInfo = null;
        if (projectId) {
            projectInfo = await prisma.project.findUnique({
                where: { id: projectId },
                include: { owner: true }
            });
        }

        const employeeData = employees.map(e => ({
            id: e.id,
            name: `${e.firstName} ${e.lastName}`,
            department: e.department?.name || 'None',
            designation: e.designation || 'None',
            currentTasks: e.assignedTasks.length
        }));

        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 500,
            messages: [
                {
                    role: 'system',
                    content: `You are a task assignment AI. Based on the task and available employees,
   suggest the best assignee. Consider workload, department relevance, and designation. Return JSON:    
  {
      "suggestedId": "employee id",
      "reason": "why this person is best suited",
      "alternativeIds": ["2nd best", "3rd best"]
  }`
                },
                {
                    role: 'user',
                    content: `Task: ${taskTitle}
  Description: ${taskDescription || 'No description'}
  Project: ${projectInfo?.name || 'No project'}
  Project Owner: ${projectInfo?.owner ? `${projectInfo.owner.firstName} ${projectInfo.owner.lastName}` :
                            'None'}

  Available Employees:
  ${employeeData.map(e => `- ID: ${e.id}, Name: ${e.name}, Dept: ${e.department}, Role:
  ${e.designation}, Current Tasks: ${e.currentTasks}`).join('\n')}`
                }
            ]
        });

        let suggestion;
        try {
            suggestion = JSON.parse(response.choices[0]?.message?.content || '{}');
        } catch {
            suggestion = { suggestedId: null, reason: 'Unable to determine', alternativeIds: [] };
        }

        const suggestedEmployee = employees.find(e => e.id === suggestion.suggestedId);
        const alternatives = suggestion.alternativeIds
            ?.map((id: string) => employees.find(e => e.id === id))
            .filter(Boolean) || [];

        return {
            suggestedEmployeeId: suggestion.suggestedId,
            suggestedEmployee: suggestedEmployee || null,
            reason: suggestion.reason,
            alternatives
        };
    }

    // ==================== REPORT GENERATOR ====================
    async generateReport(
        reportType: 'attendance' | 'leave' | 'task' | 'employee',
        dateRange: { start: string; end: string },
        orgId: string
    ): Promise<{
        title: string;
        summary: string;
        data: any;
        insights: string[];
    }> {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        let data: any = {};
        let rawData: any[] = [];

        switch (reportType) {
            case 'attendance':
                rawData = await prisma.attendance.findMany({
                    where: {
                        employee: { organizationId: orgId },
                        date: { gte: startDate, lte: endDate }
                    },
                    include: { employee: true }
                });
                data = {
                    total: rawData.length,
                    present: rawData.filter(a => a.status === 'PRESENT').length,
                    absent: rawData.filter(a => a.status === 'ABSENT').length,
                    late: rawData.filter(a => a.status === 'LATE').length,
                    halfDay: rawData.filter(a => a.status === 'HALF_DAY').length
                };
                break;

            case 'leave':
                rawData = await prisma.leaveRequest.findMany({
                    where: {
                        employee: { organizationId: orgId },
                        startDate: { gte: startDate, lte: endDate }
                    },
                    include: { employee: true, leaveType: true }
                });
                data = {
                    total: rawData.length,
                    approved: rawData.filter(l => l.status === 'APPROVED').length,
                    pending: rawData.filter(l => l.status === 'PENDING').length,
                    rejected: rawData.filter(l => l.status === 'REJECTED').length
                };
                break;

            case 'task':
                rawData = await prisma.task.findMany({
                    where: {
                        organizationId: orgId,
                        createdAt: { gte: startDate, lte: endDate }
                    },
                    include: { assignee: true, project: true }
                });
                data = {
                    total: rawData.length,
                    completed: rawData.filter(t => t.status === 'DONE').length,
                    inProgress: rawData.filter(t => t.status === 'IN_PROGRESS').length,
                    todo: rawData.filter(t => t.status === 'TODO').length,
                    highPriority: rawData.filter(t => t.priority === 'HIGH' || t.priority ===
                        'URGENT').length
                };
                break;

            case 'employee':
                rawData = await prisma.employee.findMany({
                    where: { organizationId: orgId },
                    include: { department: true }
                });
                data = {
                    total: rawData.length,
                    active: rawData.filter(e => e.status === 'ACTIVE').length,
                    onLeave: rawData.filter(e => e.status === 'ON_LEAVE').length,
                    onNotice: rawData.filter(e => e.status === 'ON_NOTICE').length,
                    byDepartment: rawData.reduce((acc: any, e) => {
                        const dept = e.department?.name || 'Unassigned';
                        acc[dept] = (acc[dept] || 0) + 1;
                        return acc;
                    }, {})
                };
                break;
        }

        // Generate AI insights
        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 500,
            messages: [
                {
                    role: 'system',
                    content: `Generate a report summary and insights. Return JSON:
  {
      "summary": "2-3 sentence summary",
      "insights": ["insight 1", "insight 2", "insight 3"]
  }`
                },
                {
                    role: 'user',
                    content: `Report Type: ${reportType}
  Date Range: ${dateRange.start} to ${dateRange.end}
  Data: ${JSON.stringify(data)}`
                }
            ]
        });

        let aiResponse;
        try {
            aiResponse = JSON.parse(response.choices[0]?.message?.content || '{}');
        } catch {
            aiResponse = { summary: 'Report generated', insights: [] };
        }

        return {
            title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
            summary: aiResponse.summary,
            data,
            insights: aiResponse.insights
        };
    }
}