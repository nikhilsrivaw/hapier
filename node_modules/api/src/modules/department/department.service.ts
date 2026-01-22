 import prisma from '../../lib/prisma';

  export const departmentService = {
    async getAll(orgId: string) {
      return prisma.department.findMany({
        where: { organizationId: orgId },
        include: {
          _count: {
            select: { employees: true },
          },
        },
        orderBy: { name: 'asc' },
      });
    },

    async getById(id: string, orgId: string) {
      const department = await prisma.department.findFirst({
        where: { id, organizationId: orgId },
        include: {
          employees: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              designation: true,
              employeeCode: true,
            },
          },
        },
      });

      if (!department) {
        throw new Error('Department not found');
      }

      return department;
    },

    async create(orgId: string, data: { name: string }) {
      return prisma.department.create({
        data: {
          name: data.name,
          organizationId: orgId,
        },
      });
    },

    async update(id: string, orgId: string, data: { name: string }) {
      const department = await prisma.department.findFirst({
        where: { id, organizationId: orgId },
      });

      if (!department) {
        throw new Error('Department not found');
      }

      return prisma.department.update({
        where: { id },
        data: { name: data.name },
      });
    },

    async delete(id: string, orgId: string) {
      const department = await prisma.department.findFirst({
        where: { id, organizationId: orgId },
        include: { _count: { select: { employees: true } } },
      });

      if (!department) {
        throw new Error('Department not found');
      }

      if (department._count.employees > 0) {
        throw new Error('Cannot delete department with employees');
      }

      await prisma.department.delete({ where: { id } });
      return { message: 'Department deleted successfully' };
    },
  };
