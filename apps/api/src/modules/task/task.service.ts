import prisma from "../../lib/prisma";


  export const taskService = {
      async getAll(orgId: string, filters?: { status?: string; assigneeId?: string; priority?: string
   }) {
          const where: any = { organizationId: orgId };

          if (filters?.status) where.status = filters.status;
          if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
          if (filters?.priority) where.priority = filters.priority;

          return prisma.task.findMany({
              where,
              include: {
                  assignee: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                  },
                  creator: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
              orderBy: { createdAt: 'desc' },
          });
      },

      async getById(id: string, orgId: string) {
          const task = await prisma.task.findFirst({
              where: { id, organizationId: orgId },
              include: {
                  assignee: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                  },
                  creator: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
          });

          if (!task) {
              throw new Error('Task not found');
          }

          return task;
      },

      async create(orgId: string, creatorId: string, data: {
          title: string;
          description?: string;
          status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          dueDate?: string;
          assigneeId?: string;
      }) {
          return prisma.task.create({
              data: {
                  title: data.title,
                  description: data.description,
                  status: data.status || 'TODO',
                  priority: data.priority || 'MEDIUM',
                  dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                  assigneeId: data.assigneeId || null,
                  creatorId: creatorId,
                  organizationId: orgId,
              },
              include: {
                  assignee: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                  },
                  creator: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
          });
      },

      async update(id: string, orgId: string, data: {
          title?: string;
          description?: string;
          status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          dueDate?: string;
          assigneeId?: string | null;
      }) {
          const task = await prisma.task.findFirst({
              where: { id, organizationId: orgId },
          });

          if (!task) {
              throw new Error('Task not found');
          }

          return prisma.task.update({
              where: { id },
              data: {
                  ...data,
                  dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
              },
              include: {
                  assignee: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                  },
                  creator: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
          });
      },

      async delete(id: string, orgId: string) {
          const task = await prisma.task.findFirst({
              where: { id, organizationId: orgId },
          });

          if (!task) {
              throw new Error('Task not found');
          }

          await prisma.task.delete({ where: { id } });

          return { message: 'Task deleted successfully' };
      },
  };