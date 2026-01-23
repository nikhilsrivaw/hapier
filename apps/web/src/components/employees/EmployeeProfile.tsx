'use client';                                                                                      

  import { useRouter } from 'next/navigation';
  import { motion } from 'framer-motion';
  import { format } from 'date-fns';
  import { Employee } from '@/types';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import {
    ArrowLeft,
    Pencil,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building2,
    Briefcase,
    IndianRupee,
    User,
  } from 'lucide-react';

  const statusColors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-teal-50', text: 'text-teal-700' },
    ON_NOTICE: { bg: 'bg-amber-50', text: 'text-amber-700' },
    TERMINATED: { bg: 'bg-red-50', text: 'text-red-700' },
    ON_LEAVE: { bg: 'bg-blue-50', text: 'text-blue-700' },
  };

  interface EmployeeProfileProps {
    employee: Employee;
  }

  export default function EmployeeProfile({ employee }: EmployeeProfileProps) {
    const router = useRouter();

    const infoItems = [
      { icon: Mail, label: 'Email', value: employee.email },
      { icon: Phone, label: 'Phone', value: employee.phone || 'Not provided' },
      { icon: MapPin, label: 'Address', value: employee.address || 'Not provided' },
      { icon: Calendar, label: 'Date of Birth', value: employee.dateOfBirth ? format(new
  Date(employee.dateOfBirth), 'MMM d, yyyy') : 'Not provided' },
      { icon: User, label: 'Gender', value: employee.gender || 'Not provided' },
    ];

    const jobItems = [
      { icon: Briefcase, label: 'Designation', value: employee.designation },
      { icon: Building2, label: 'Department', value: employee.department?.name || 'Not assigned' },  
      { icon: Calendar, label: 'Joining Date', value: format(new Date(employee.joiningDate), 'MMM d, yyyy') },
      { icon: IndianRupee, label: 'Salary', value: `₹${parseFloat(employee.salary).toLocaleString()}`
   },
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" onClick={() => router.push('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => router.push(`/employees/${employee.id}/edit`)}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />      
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16       
  sm:-mt-12">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center
  justify-center border-4 border-white">
                  <span className="text-3xl font-bold text-rose-600">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </div>
                <div className="text-center sm:text-left sm:pb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-gray-500">{employee.designation}</p>
                  <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">     
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {employee.employeeCode}
                    </code>
                    <Badge className={`${statusColors[employee.status]?.bg}
  ${statusColors[employee.status]?.text} border-0`}>
                      {employee.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center
  justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Job Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {jobItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center
  justify-center">
                      <item.icon className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
