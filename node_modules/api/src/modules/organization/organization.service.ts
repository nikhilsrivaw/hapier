  import prisma from '../../lib/prisma';

  export const organizationService = {
    async getById(orgId: string) {
      const organization = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
          _count: {
            select: {
              employees: true,
              departments: true,
              users: true,
            },
          },
        },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      return organization;
    },

    async update(orgId: string, data: {
      name?: string;
      logo?: string;
    }) {
      return prisma.organization.update({
        where: { id: orgId },
        data,
      });
    },

    async getDashboardStats(orgId: string) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalEmployees,
        activeEmployees,
        departments,
        todayAttendance,
        pendingLeaves,
      ] = await Promise.all([
        // Total employees
        prisma.employee.count({
          where: { organizationId: orgId },
        }),
        // Active employees
        prisma.employee.count({
          where: { organizationId: orgId, status: 'ACTIVE' },
        }),
        // Departments
        prisma.department.count({
          where: { organizationId: orgId },
        }),
        // Today's attendance
        prisma.attendance.count({
          where: {
            date: today,
            employee: { organizationId: orgId },
          },
        }),
        // Pending leave requests
        prisma.leaveRequest.count({
          where: {
            status: 'PENDING',
            employee: { organizationId: orgId },
          },
        }),
      ]);

      return {
        totalEmployees,
        activeEmployees,
        departments,
        todayAttendance,
        pendingLeaves,
        attendancePercentage: totalEmployees > 0
          ? Math.round((todayAttendance / activeEmployees) * 100)
          : 0,
      };
    },
  };