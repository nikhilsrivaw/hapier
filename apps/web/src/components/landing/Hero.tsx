 'use client';                                                                                      
  
  import Link from 'next/link';
  import { motion } from 'framer-motion';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Card } from '@/components/ui/card';
  import {
    ArrowRight,
    Play,
    Users,
    CalendarCheck,
    Clock,
    CheckCircle2,
    TrendingUp
  } from 'lucide-react';

  const trustedCompanies = ['Razorpay', 'Zerodha', 'Swiggy', 'PhonePe', 'CRED'];

  export default function Hero() {
    return (
      <section className="pt-24 lg:pt-32 pb-16 px-6 overflow-hidden bg-gradient-to-b from-rose-50/50 
  via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 px-4 py-2  
  text-sm font-medium">
                #1 HRMS for Indian Businesses
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]  
  mb-6">
                Work management{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600        
  to-orange-500">
                  that works for you
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Connect your workforce, streamline HR operations, and build a culture where everyone 
  thrives.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg px-8
   h-14 text-base shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40
  transition-all"
                  >
                    Get started free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg px-8 h-14 text-base font-semibold border-2 border-gray-200   
  hover:border-gray-300 hover:bg-gray-50"
                >
                  <Play className="w-5 h-5 mr-2 fill-rose-600 text-rose-600" />
                  See how it works
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">Trusted by 500+ companies in India</p>     
                <div className="flex flex-wrap items-center gap-6">
                  {trustedCompanies.map((company, index) => (
                    <motion.span
                      key={company}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-gray-400 font-semibold text-lg"
                    >
                      {company}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative lg:pl-8"
            >
              {/* Background decorations */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-rose-200   
  to-orange-200 rounded-full blur-3xl opacity-30" />
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-teal-200 
  to-cyan-200 rounded-full blur-3xl opacity-30" />

              {/* Main Dashboard Card */}
              <Card className="relative bg-white shadow-2xl border border-gray-100 rounded-2xl       
  overflow-hidden">
                {/* Browser bar */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b
  border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-lg px-4 py-1 text-xs text-gray-500 border">     
                      app.hapier.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 bg-gray-50">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">Good morning, Priya 👋</h3>        
                      <p className="text-sm text-gray-500">Here's your team overview</p>
                    </div>
                    <Badge className="bg-teal-100 text-teal-700 border-0">Live</Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { icon: Users, label: 'Employees', value: '248', color: 'rose' },
                      { icon: CalendarCheck, label: 'Present', value: '94%', color: 'teal' },        
                      { icon: Clock, label: 'Pending', value: '5', color: 'amber' },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                      >
                        <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center   
  justify-center mb-2`}>
                          <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity List */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Recent Activity</span>     
                      <TrendingUp className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Rahul Sharma', action: 'checked in', time: '9:00 AM', color: 'teal' 
  },
                        { name: 'Anita Patel', action: 'requested leave', time: '9:15 AM', color:    
  'amber' },
                        { name: 'Dev Kumar', action: 'completed review', time: '9:30 AM', color:     
  'rose' },
                      ].map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.15 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex        
  items-center justify-center`}>
                            <span className={`text-xs font-medium text-${activity.color}-600`}>      
                              {activity.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.name}</span>{' '}
                              <span className="text-gray-500">{activity.action}</span>
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">{activity.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-3 border
  border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Attendance marked</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-3 border     
  border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">+12 new hires</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
