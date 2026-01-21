import prisma from '../../lib/prisma';

export const employeeService = {
    async getAll(orgId: string) {
        return prisma.employee.findMany({
            where: { organizationId: orgId },
            include: {
                department: true,
                user: {
                    select: { email: true, role: true, isActive: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getById(id: string, orgId: string) {
        const employee = await prisma.employee.findFirst({
            where: { id, organizationId: orgId },
            include: {
                department: true,
                manager: {
                    select: { id: true, firstName: true, lastName: true },
                },
                user: {
                    select: { email: true, role: true, isActive: true },
                },
            },
        });

        if (!employee) {
            throw new Error('Employee not found');
        }

        return employee;
    },

    async create(orgId: string, data: {
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        dateOfBirth?: Date;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
        joiningDate: string;
        designation: string;
        salary: number;
        departmentId: string;
        managerId?: string;
    }) {
        return prisma.employee.create({
            data: {
                employeeCode: data.employeeCode,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                address: data.address,
                joiningDate: new Date(data.joiningDate),
                designation: data.designation,
                salary: data.salary,
                departmentId: data.departmentId,
                managerId: data.managerId,
                organizationId: orgId,
            },
            include: {
                department: true,
            },
        });
    },

    async update(id: string, orgId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        dateOfBirth?: Date;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
        designation?: string;
        salary?: number;
        departmentId?: string;
        managerId?: string;
        status?: 'ACTIVE' | 'ON_NOTICE' | 'TERMINATED' | 'ON_LEAVE';
    }) {
        const employee = await prisma.employee.findFirst({
            where: { id, organizationId: orgId },
        });

        if (!employee) {
            throw new Error('Employee not found');
        }

        return prisma.employee.update({
            where: { id },
            data,
            include: {
                department: true,
            },
        });
    },

    async delete(id: string, orgId: string) {
        const employee = await prisma.employee.findFirst({
            where: { id, organizationId: orgId },
        });

        if (!employee) {
            throw new Error('Employee not found');
        }

        await prisma.employee.delete({
            where: { id },
        });

        return { message: 'Employee deleted successfully' };
    },
};
