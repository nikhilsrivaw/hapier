import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authService = {
  async register(data: {
    email: string;
    password: string;
    organizationName: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create organization, user, and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
        },
      });

      // Create default department
      const department = await tx.department.create({
        data: {
          name: 'General',
          organizationId: organization.id,
        },
      });

      // Create user as admin
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          role: 'ADMIN',
          organizationId: organization.id,
        },
      });

      // Create employee profile
      const employee = await tx.employee.create({
        data: {
          employeeCode: 'EMP001',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          joiningDate: new Date(),
          designation: 'Admin',
          salary: 0,
          organizationId: organization.id,
          departmentId: department.id,
          userId: user.id,
        },
      });

      return { user, organization, employee };
    });

    // Generate token
    const token = jwt.sign(
      { userId: result.user.id, role: result.user.role, orgId: result.organization.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        employeeId: result.employee.id,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        employee: true,
      },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, orgId: user.organizationId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee?.id || null,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
      },
    };
  },
};
