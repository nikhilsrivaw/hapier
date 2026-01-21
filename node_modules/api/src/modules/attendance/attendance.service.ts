  import prisma from '../../lib/prisma';                                                             

  export const attendanceService = {
    // Check in
    async checkIn(employeeId: string, orgId: string) {
      // Verify employee belongs to organization
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if already checked in today
      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId,
            date: today,
          },
        },
      });

      if (existingAttendance) {
        throw new Error('Already checked in today');
      }

      return prisma.attendance.create({
        data: {
          employeeId,
          date: today,
          checkIn: new Date(),
          status: 'PRESENT',
        },
      });
    },

    // Check out
    async checkOut(employeeId: string, orgId: string) {
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await prisma.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId,
            date: today,
          },
        },
      });

      if (!attendance) {
        throw new Error('No check-in found for today');
      }

      if (attendance.checkOut) {
        throw new Error('Already checked out today');
      }

      return prisma.attendance.update({
        where: { id: attendance.id },
        data: { checkOut: new Date() },
      });
    },

    // Get attendance for an employee
    async getByEmployee(employeeId: string, orgId: string, month?: number, year?: number) {
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const now = new Date();
      const targetMonth = month ?? now.getMonth();
      const targetYear = year ?? now.getFullYear();

      const startDate = new Date(targetYear, targetMonth, 1);
      const endDate = new Date(targetYear, targetMonth + 1, 0);

      return prisma.attendance.findMany({
        where: {
          employeeId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'desc' },
      });
    },

    // Get today's attendance for all employees in org
    async getTodayAll(orgId: string) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return prisma.attendance.findMany({
        where: {
          date: today,
          employee: {
            organizationId: orgId,
          },
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeCode: true,
              department: true,
            },
          },
        },
      });
    },

    // Mark attendance manually (for HR/Admin)
    async markAttendance(orgId: string, data: {
      employeeId: string;
      date: string;
      status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE';
      checkIn?: string;
      checkOut?: string;
      notes?: string;
    }) {
      const employee = await prisma.employee.findFirst({
        where: { id: data.employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const date = new Date(data.date);
      date.setHours(0, 0, 0, 0);

      return prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: data.employeeId,
            date,
          },
        },
        update: {
          status: data.status,
          checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
          checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
          notes: data.notes,
        },
        create: {
          employeeId: data.employeeId,
          date,
          status: data.status,
          checkIn: data.checkIn ? new Date(data.checkIn) : null,
          checkOut: data.checkOut ? new Date(data.checkOut) : null,
          notes: data.notes,
        },
      });
    },
  };
