  import prisma from '../../lib/prisma';

  export const leaveService = {
    // Create leave request
    async createRequest(employeeId: string, orgId: string, data: {
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason: string;
    }) {
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      return prisma.leaveRequest.create({
        data: {
          employeeId,
          leaveTypeId: data.leaveTypeId,
          startDate,
          endDate,
          reason: data.reason,
          status: 'PENDING',
        },
        include: {
          leaveType: true,
          employee: {
            select: { firstName: true, lastName: true, employeeCode: true },
          },
        },
      });
    },

    // Get leave requests for an employee
    async getByEmployee(employeeId: string, orgId: string) {
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, organizationId: orgId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      return prisma.leaveRequest.findMany({
        where: { employeeId },
        include: {
          leaveType: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    // Get all pending requests (for HR/Admin)
    async getPendingRequests(orgId: string) {
      return prisma.leaveRequest.findMany({
        where: {
          status: 'PENDING',
          employee: {
            organizationId: orgId,
          },
        },
        include: {
          leaveType: true,
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
        orderBy: { createdAt: 'asc' },
      });
    },

    // Get all leave requests (for HR/Admin)
    async getAll(orgId: string, status?: string) {
      return prisma.leaveRequest.findMany({
        where: {
          status: status ? (status as any) : undefined,
          employee: {
            organizationId: orgId,
          },
        },
        include: {
          leaveType: true,
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
        orderBy: { createdAt: 'desc' },
      });
    },

    // Approve/Reject leave request
    async updateStatus(requestId: string, orgId: string, approverId: string, data: {
      status: 'APPROVED' | 'REJECTED';
    }) {
      const request = await prisma.leaveRequest.findFirst({
        where: {
          id: requestId,
          employee: {
            organizationId: orgId,
          },
        },
      });

      if (!request) {
        throw new Error('Leave request not found');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Request already processed');
      }

      return prisma.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: data.status,
          approvedById: approverId,
        },
        include: {
          leaveType: true,
          employee: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });
    },

    // Cancel leave request (by employee)
    async cancelRequest(requestId: string, employeeId: string) {
      const request = await prisma.leaveRequest.findFirst({
        where: {
          id: requestId,
          employeeId,
        },
      });

      if (!request) {
        throw new Error('Leave request not found');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Can only cancel pending requests');
      }

      return prisma.leaveRequest.update({
        where: { id: requestId },
        data: { status: 'CANCELLED' },
      });
    },

    // Leave types CRUD
    async createLeaveType(orgId: string, data: {
      name: string;
      daysAllowed: number;
      carryForward?: boolean;
      isPaid?: boolean;
    }) {
      return prisma.leaveType.create({
        data: {
          ...data,
          organizationId: orgId,
        },
      });
    },

    async getLeaveTypes(orgId: string) {
      return prisma.leaveType.findMany({
        where: { organizationId: orgId },
      });
    },
  };
