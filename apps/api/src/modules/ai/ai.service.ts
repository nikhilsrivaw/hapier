  import OpenAI from 'openai';
  import prisma  from '../../lib/prisma';

  export class AIService {
      private openai: OpenAI;

      constructor() {
          this.openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY,
          });
      }

      async processChat(message: string, userId: string, orgId: string): Promise<string> {
          // Fetch context about the user
          const employee = await prisma.employee.findFirst({
              where: { userId, organizationId: orgId },
              include: { department: true }
          });

          const leaveBalance = await prisma.leaveRequest.count({
              where: {
                  employeeId: employee?.id,
                  status: 'APPROVED',
                  startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
              }
          });

          const systemPrompt = `You are Hapier AI, a helpful HR assistant for ${employee?.firstName ||  
  'the employee'}.
  Employee Info: ${employee ? `${employee.firstName} ${employee.lastName}, ${employee.department?.name  
  || 'No department'}, ${employee.designation || 'No designation'}` : 'Unknown'}
  Approved leaves this year: ${leaveBalance}

  Help with HR queries like leave balance, policies, attendance, and general HR questions.
  Keep responses concise and helpful. If you don't know something specific, suggest they contact HR.`;  

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
  }
