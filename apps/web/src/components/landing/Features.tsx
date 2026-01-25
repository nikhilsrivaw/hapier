  'use client';                                                                                         
  import { motion } from 'framer-motion';                                                            
  import { Badge } from '@/components/ui/badge';
  import { Card } from '@/components/ui/card';
  import {
      Users,
      CalendarCheck,
      Clock,
      FolderKanban,
      CheckSquare,
      BarChart3,
      Plus,
      GripVertical,
      Check,
      TrendingUp,
  } from 'lucide-react';

  // Mini Kanban Board Preview
  function KanbanPreview() {
      const columns = [
          { name: 'To Do', color: 'bg-gray-100', tasks: ['Design review', 'API integration'] },      
          { name: 'In Progress', color: 'bg-blue-100', tasks: ['Dashboard UI'] },
          { name: 'Done', color: 'bg-green-100', tasks: ['Auth flow'] },
      ];

      return (
          <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl overflow-x-auto       
  scrollbar-hide">
              {columns.map((col, i) => (
                  <motion.div
                      key={col.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-1 min-w-[100px] sm:min-w-[120px]"
                  >
                      <div className={`${col.color} rounded-lg p-1.5 sm:p-2 mb-2`}>
                          <span className="text-[10px] sm:text-xs font-semibold
  text-gray-700">{col.name}</span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                          {col.tasks.map((task) => (
                              <motion.div
                                  key={task}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm border       
  border-gray-100 cursor-pointer"
                              >
                                  <div className="flex items-center gap-1 sm:gap-2">
                                      <GripVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3
  text-gray-300" />
                                      <span className="text-[10px] sm:text-xs text-gray-700
  truncate">{task}</span>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </motion.div>
              ))}
          </div>
      );
  }

  // Mini Project Cards Preview
  function ProjectsPreview() {
      const projects = [
          { name: 'Website Redesign', progress: 75, tasks: 12, color: 'bg-rose-500' },
          { name: 'Mobile App', progress: 45, tasks: 8, color: 'bg-blue-500' },
          { name: 'API Development', progress: 90, tasks: 5, color: 'bg-emerald-500' },
      ];

      return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
              {projects.map((project, i) => (
                  <motion.div
                      key={project.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-gray-100   
  cursor-pointer"
                  >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full
  ${project.color}`} />
                              <span className="text-xs sm:text-sm font-medium text-gray-800 truncate 
  max-w-[120px] sm:max-w-none">{project.name}</span>
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-500">{project.tasks}     
  tasks</span>
                      </div>
                      <div className="h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">        
                          <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${project.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                              className={`h-full ${project.color} rounded-full`}
                          />
                      </div>
                  </motion.div>
              ))}
          </div>
      );
  }

  // Mini Employee Grid Preview
  function EmployeePreview() {
      const employees = [
          { name: 'Priya S.', role: 'Designer', status: 'active' },
          { name: 'Rahul K.', role: 'Developer', status: 'active' },
          { name: 'Anita P.', role: 'Manager', status: 'away' },
          { name: 'Dev M.', role: 'Engineer', status: 'active' },
      ];

      return (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4">
              {employees.map((emp, i) => (
                  <motion.div
                      key={emp.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100     
  cursor-pointer"
                  >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="relative flex-shrink-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-rose-400  
  to-orange-400 rounded-full flex items-center justify-center">
                                  <span className="text-[8px] sm:text-xs font-medium text-white">    
                                      {emp.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 
  rounded-full border-2 border-white ${emp.status === 'active' ? 'bg-green-400' : 'bg-amber-400'}`}  
  />
                          </div>
                          <div className="min-w-0">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-800
  truncate">{emp.name}</p>
                              <p className="text-[8px] sm:text-[10px] text-gray-500
  truncate">{emp.role}</p>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      );
  }

  // Mini Attendance Calendar Preview
  function AttendancePreview() {
      const days = ['M', 'T', 'W', 'T', 'F'];
      const statuses = ['present', 'present', 'present', 'leave', 'present'];

      return (
          <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">This Week</span>    
                  <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs      
  px-1.5 sm:px-2">96%</Badge>
              </div>
              <div className="flex gap-1.5 sm:gap-2 justify-between">
                  {days.map((day, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex flex-col items-center gap-1 sm:gap-2"
                      >
                          <span className="text-[10px] sm:text-xs text-gray-500">{day}</span>        
                          <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex      
  items-center justify-center ${
                                  statuses[i] === 'present'
                                      ? 'bg-green-100'
                                      : 'bg-amber-100'
                              }`}
                          >
                              {statuses[i] === 'present' ? (
                                  <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" />     
                              ) : (
                                  <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600" />     
                              )}
                          </motion.div>
                      </motion.div>
                  ))}
              </div>
              <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs    
  text-gray-500"
              >
                  <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" />        
                      <span>Present</span>
                  </div>
                  <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full" />        
                      <span>Leave</span>
                  </div>
              </motion.div>
          </div>
      );
  }

  // Mini Leave Request Preview
  function LeavePreview() {
      const requests = [
          { name: 'Sick Leave', days: 2, status: 'approved' },
          { name: 'Casual Leave', days: 1, status: 'pending' },
      ];

      return (
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {requests.map((req, i) => (
                  <motion.div
                      key={req.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100"    
                  >
                      <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-800
  truncate">{req.name}</p>
                              <p className="text-[10px] sm:text-xs text-gray-500">{req.days}
  day{req.days > 1 ? 's' : ''}</p>
                          </div>
                          <Badge className={`border-0 text-[10px] sm:text-xs px-1.5 sm:px-2
  flex-shrink-0 ${
                              req.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                          }`}>
                              {req.status === 'approved' ? (
                                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />     
                              ) : (
                                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />     
                              )}
                              <span className="hidden sm:inline">{req.status}</span>
                              <span className="sm:hidden">{req.status === 'approved' ? '✓' :
  '...'}</span>
                          </Badge>
                      </div>
                  </motion.div>
              ))}
              <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full py-1.5 sm:py-2 border-2 border-dashed border-gray-200 rounded-xl 
  text-[10px] sm:text-xs text-gray-500 flex items-center justify-center gap-1 hover:border-gray-300  
  transition-colors"
              >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Request Leave
              </motion.button>
          </div>
      );
  }

  // Mini Analytics Preview
  function AnalyticsPreview() {
      const bars = [65, 80, 45, 90, 70, 85, 95];

      return (
          <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Performance</span>  
                  <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">+12%</span>
                  </div>
              </div>
              <div className="flex items-end gap-1 sm:gap-2 h-16 sm:h-24">
                  {bars.map((height, i) => (
                      <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.1 }}
                          className="flex-1 bg-gradient-to-t from-rose-500 to-orange-400 rounded-t-md
   sm:rounded-t-lg cursor-pointer min-w-[8px]"
                      />
                  ))}
              </div>
              <div className="flex justify-between mt-1.5 sm:mt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i} className="text-[8px] sm:text-[10px] text-gray-400 flex-1        
  text-center">{d}</span>
                  ))}
              </div>
          </div>
      );
  }

  const features = [
      {
          icon: CheckSquare,
          title: 'Task Management',
          description: 'Kanban boards, assignments, priorities, and due dates.',
          color: 'from-rose-500 to-orange-500',
          preview: KanbanPreview,
      },
      {
          icon: FolderKanban,
          title: 'Project Tracking',
          description: 'Group tasks into projects. Track progress together.',
          color: 'from-blue-500 to-cyan-500',
          preview: ProjectsPreview,
      },
      {
          icon: Users,
          title: 'Employee Directory',
          description: 'Complete profiles and org hierarchy at your fingertips.',
          color: 'from-violet-500 to-purple-500',
          preview: EmployeePreview,
      },
      {
          icon: CalendarCheck,
          title: 'Attendance Tracking',
          description: 'One-click check-in and real-time tracking.',
          color: 'from-emerald-500 to-teal-500',
          preview: AttendancePreview,
      },
      {
          icon: Clock,
          title: 'Leave Management',
          description: 'Request, approve, and track leaves easily.',
          color: 'from-amber-500 to-yellow-500',
          preview: LeavePreview,
      },
      {
          icon: BarChart3,
          title: 'Analytics & Reports',
          description: 'Data-driven insights for better decisions.',
          color: 'from-pink-500 to-rose-500',
          preview: AnalyticsPreview,
      },
  ];

  export default function Features() {
      return (
          <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white  
  via-gray-50 to-white overflow-hidden">
              <div className="max-w-7xl mx-auto">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-2"
                  >
                      <Badge className="mb-3 sm:mb-4 bg-rose-100 text-rose-700 border-0 px-3 sm:px-4 
  py-1 sm:py-1.5 text-xs sm:text-sm">
                          What You Get
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3   
  sm:mb-4">
                          Everything to manage your{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r
  from-rose-600 to-orange-500">
                              workforce
                          </span>
                      </h2>
                      <p className="text-sm sm:text-lg text-gray-600">
                          Not just features — real tools your team will use every day.
                      </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">    
                      {features.map((feature, index) => (
                          <motion.div
                              key={feature.title}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                          >
                              <Card className="h-full border-0 shadow-lg hover:shadow-2xl
  transition-all duration-300 group overflow-hidden bg-white">
                                  {/* Preview Area */}
                                  <div className="bg-gray-50 border-b border-gray-100
  overflow-hidden">
                                      <feature.preview />
                                  </div>

                                  {/* Content */}
                                  <div className="p-4 sm:p-6">
                                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg        
  sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg        
  group-hover:scale-110 transition-transform`}>
                                              <feature.icon className="w-4 h-4 sm:w-5 sm:h-5
  text-white" />
                                          </div>
                                          <h3 className="text-base sm:text-lg font-semibold
  text-gray-900">
                                              {feature.title}
                                          </h3>
                                      </div>
                                      <p className="text-gray-600 text-xs sm:text-sm
  leading-relaxed">
                                          {feature.description}
                                      </p>
                                  </div>
                              </Card>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      );
  }
