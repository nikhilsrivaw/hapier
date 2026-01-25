'use client';

  import { motion } from 'framer-motion';
  import { Badge } from '@/components/ui/badge';
  import { UserPlus, Settings, Rocket } from 'lucide-react';

  const steps = [
      {
          icon: UserPlus,
          number: '01',
          title: 'Sign Up in Seconds',
          description: 'Create your account and set up your organization. No credit card required.', 
          color: 'from-rose-500 to-orange-500',
          bgColor: 'bg-rose-50',
      },
      {
          icon: Settings,
          number: '02',
          title: 'Configure Your Workspace',
          description: 'Add departments, invite employees, and customize settings to match your  workflow.',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
      },
      {
          icon: Rocket,
          number: '03',
          title: 'Start Managing',
          description: 'Track attendance, manage leaves, assign tasks, and watch your team thrive.', 
          color: 'from-emerald-500 to-teal-500',
          bgColor: 'bg-emerald-50',
      },
  ];

  export default function HowItWorks() {
      return (
          <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 overflow-hidden">
              <div className="max-w-6xl mx-auto">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mb-12 sm:mb-16"
                  >
                      <Badge className="mb-3 sm:mb-4 bg-emerald-100 text-emerald-700 border-0 px-3   
  sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                          Get Started
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3   
  sm:mb-4">
                          Up and running in{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r
  from-emerald-600 to-teal-500">
                              3 simple steps
                          </span>
                      </h2>
                      <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                          No complex setup. No training needed. Start managing your team in minutes. 
                      </p>
                  </motion.div>

                  <div className="relative">
                      {/* Connection Line - Desktop */}
                      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5
  bg-gradient-to-r from-rose-200 via-blue-200 to-emerald-200 -translate-y-1/2 z-0" />

                      {/* Connection Line - Mobile */}
                      <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5
  bg-gradient-to-b from-rose-200 via-blue-200 to-emerald-200 -translate-x-1/2 z-0" />

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
                          {steps.map((step, index) => (
                              <motion.div
                                  key={step.number}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.2 }}
                                  className="relative flex flex-col items-center text-center"        
                              >
                                  {/* Step Number Circle */}
                                  <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full    
  bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 sm:mb-6`}
                                  >
                                      <step.icon className="w-7 h-7 sm:w-9 sm:h-9 text-white" />     
                                      <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 
  bg-white rounded-full shadow-md flex items-center justify-center">
                                          <span className="text-xs sm:text-sm font-bold
  text-gray-800">{step.number}</span>
                                      </div>
                                  </motion.div>

                                  {/* Content Card */}
                                  <div className={`${step.bgColor} rounded-2xl p-5 sm:p-6 w-full     
  max-w-sm`}>
                                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900  
  mb-2">
                                          {step.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                          {step.description}
                                      </p>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </div>
              </div>
          </section>
      );
  }