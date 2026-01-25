'use client';

  import { useEffect, useState, useRef } from 'react';
  import { motion, useInView } from 'framer-motion';
  import { Users, Building2, CheckCircle, Globe } from 'lucide-react';

  const stats = [
      { icon: Building2, value: 500, suffix: '+', label: 'Companies', color: 'text-rose-500' },      
      { icon: Users, value: 50000, suffix: '+', label: 'Employees Managed', color: 'text-blue-500' },
      { icon: CheckCircle, value: 99.9, suffix: '%', label: 'Uptime', color: 'text-emerald-500' },   
      { icon: Globe, value: 25, suffix: '+', label: 'Cities in India', color: 'text-violet-500' },   
  ];

  function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
      const [count, setCount] = useState(0);
      const ref = useRef(null);
      const isInView = useInView(ref, { once: true });

      useEffect(() => {
          if (isInView) {
              const duration = 2000;
              const steps = 60;
              const increment = value / steps;
              let current = 0;

              const timer = setInterval(() => {
                  current += increment;
                  if (current >= value) {
                      setCount(value);
                      clearInterval(timer);
                  } else {
                      setCount(Math.floor(current));
                  }
              }, duration / steps);

              return () => clearInterval(timer);
          }
      }, [isInView, value]);

      return (
          <span ref={ref}>
              {value % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}
              {suffix}
          </span>
      );
  }

  export default function Stats() {
      return (
          <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mb-10 sm:mb-12"
                  >
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                          Trusted by teams across India
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                          Join hundreds of companies already using Hapier
                      </p>
                  </motion.div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                      {stats.map((stat, index) => (
                          <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                              className="relative group"
                          >
                              <div className="bg-gradient-to-br from-gray-50 to-white border
  border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300     
  hover:-translate-y-1">
                                  <div className={`inline-flex items-center justify-center w-10 h-10 
  sm:w-12 sm:h-12 rounded-xl bg-gray-100 mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>  
                                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                  </div>
                                  <div className={`text-2xl sm:text-4xl font-bold text-gray-900      
  mb-1`}>
                                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />    
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>   
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      );
  }