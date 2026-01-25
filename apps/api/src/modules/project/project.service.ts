
  import prisma from '../../lib/prisma';

  export const projectService = {
      async getAll(orgId: string) {
          return prisma.project.findMany({
              where: { organizationId: orgId },
              include: {
                  owner: {
                      select: { id: true, firstName: true, lastName: true },
                  },
                  _count: {
                      select: { tasks: true },
                  },
              },
              orderBy: { createdAt: 'desc' },
          });
      },

      async getById(id: string, orgId: string) {
          const project = await prisma.project.findFirst({
              where: { id, organizationId: orgId },
              include: {
                  owner: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                  },
                  tasks: {
                      include: {
                          assignee: {
                              select: { id: true, firstName: true, lastName: true },
                          },
                      },
                      orderBy: { createdAt: 'desc' },
                  },
              },
          });

          if (!project) {
              throw new Error('Project not found');
          }

          return project;
      },

      async create(orgId: string, ownerId: string, data: {
          name: string;
          description?: string;
          status?: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
          startDate?: string;
          endDate?: string;
      }) {
          return prisma.project.create({
              data: {
                  name: data.name,
                  description: data.description,
                  status: data.status || 'ACTIVE',
                  startDate: data.startDate ? new Date(data.startDate) : undefined,
                  endDate: data.endDate ? new Date(data.endDate) : undefined,
                  ownerId: ownerId,
                  organizationId: orgId,
              },
              include: {
                  owner: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
          });
      },

      async update(id: string, orgId: string, data: {
          name?: string;
          description?: string;
          status?: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
          startDate?: string;
          endDate?: string;
          ownerId?: string;
      }) {
          const project = await prisma.project.findFirst({
              where: { id, organizationId: orgId },
          });

          if (!project) {
              throw new Error('Project not found');
          }

          return prisma.project.update({
              where: { id },
              data: {
                  ...data,
                  startDate: data.startDate ? new Date(data.startDate) : undefined,
                  endDate: data.endDate ? new Date(data.endDate) : undefined,
              },
              include: {
                  owner: {
                      select: { id: true, firstName: true, lastName: true },
                  },
              },
          });
      },

      async delete(id: string, orgId: string) {
          const project = await prisma.project.findFirst({
              where: { id, organizationId: orgId },
          });

          if (!project) {
              throw new Error('Project not found');
          }

          // Remove project reference from tasks first
          await prisma.task.updateMany({
              where: { projectId: id },
              data: { projectId: null },
          });

          await prisma.project.delete({ where: { id } });

          return { message: 'Project deleted successfully' };
      },
  };
