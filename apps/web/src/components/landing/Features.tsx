'use client';

  import { motion } from 'framer-motion';
  import { Card, CardContent } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import {
    Users,
    CalendarCheck,
    Clock,
    Building2,
    TrendingUp,
    Shield,
  } from 'lucide-react';

  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Complete profiles, documents, and org hierarchy in one place.',
      color: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
    {
      icon: CalendarCheck,
      title: 'Attendance Tracking',
      description: 'Real-time tracking with GPS and biometric support.',
      color: 'bg-teal-50',
      iconColor: 'text-teal-500',
    },
    {
      icon: Clock,
      title: 'Leave Management',
      description: 'Smart request and approval workflows.',
      color: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      icon: Building2,
      title: 'Departments',
      description: 'Organize teams and visualize company structure.',
      color: 'bg-sky-50',
      iconColor: 'text-sky-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Data-driven insights with custom reports.',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Role-based permissions and data protection.',
      color: 'bg-violet-50',
      iconColor: 'text-violet-500',
    },
  ];

  export default function Features() {
    return (
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-sky-50 text-sky-600 border-0 px-4 py-1.5">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for HR
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed for modern teams. Simple enough for everyone.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow   
  group">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-xl flex items-center      
  justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }