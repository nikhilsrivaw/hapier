  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import authRoutes from './modules/auth/auth.routes';
  import employeeRoutes from './modules/employee/employee.routes';
  import attendanceRoutes from './modules/attendance/attendance.routes';
  import leaveRoutes from './modules/leave/leave.routes';
  import organizationRoutes from './modules/organization/oraganization.routes';
  import departmentRoutes from './modules/department/department.routes';
  import taskRoutes from './modules/task/task.routes';

  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/leave', leaveRoutes);
  app.use('/api/organization', organizationRoutes);
  app.use('/api/departments', departmentRoutes);
   app.use('/api/tasks', taskRoutes);

  app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
  });
