'use client';

  import { motion } from 'framer-motion';
  import { Badge } from '@/components/ui/badge';
  import { Card } from '@/components/ui/card';
  import { Star, Quote } from 'lucide-react';

  const testimonials = [
      {
          name: 'Priya Sharma',
          role: 'HR Manager',
          company: 'TechStart Solutions',
          image: null,
          content: 'Hapier transformed how we manage our 50+ team. Attendance tracking alone saved u 10 hours every week.',
          rating: 5,
      },
      {
          name: 'Rahul Verma',
          role: 'Founder & CEO',
          company: 'GrowthBox India',
          image: null,
          content: 'Finally, an HRMS that understands Indian businesses. The leave management with Indian holidays is perfect.',
          rating: 5,
      },
      {
          name: 'Anita Patel',
          role: 'Operations Head',
          company: 'CloudNine Consulting',
          image: null,
          content: 'We evaluated 5 tools before choosing Hapier. Best decision we made. Our team  actually enjoys using it!',
          rating: 5,
      },
  ];

  export default function Testimonials() {
      return (
          <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mb-12 sm:mb-16"
                  >
                      <Badge className="mb-3 sm:mb-4 bg-violet-100 text-violet-700 border-0 px-3     
  sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                          Testimonials
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3   
  sm:mb-4">
                          Loved by teams{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r
  from-violet-600 to-purple-500">
                              everywhere
                          </span>
                      </h2>
                      <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                          Don&apos;t just take our word for it. Here&apos;s what our customers say.  
                      </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">    
                      {testimonials.map((testimonial, index) => (
                          <motion.div
                              key={testimonial.name}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                          >
                              <Card className="h-full border-0 shadow-lg hover:shadow-xl
  transition-all duration-300 p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 group">
                                  {/* Quote Icon */}
                                  <div className="mb-4">
                                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-rose-200        
  group-hover:text-rose-300 transition-colors" />
                                  </div>

                                  {/* Rating */}
                                  <div className="flex gap-1 mb-3 sm:mb-4">
                                      {[...Array(testimonial.rating)].map((_, i) => (
                                          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5
  fill-amber-400 text-amber-400" />
                                      ))}
                                  </div>

                                  {/* Content */}
                                  <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6      
  leading-relaxed">
                                      &ldquo;{testimonial.content}&rdquo;
                                  </p>

                                  {/* Author */}
                                  <div className="flex items-center gap-3 pt-4 border-t
  border-gray-100">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br    
  from-rose-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-sm sm:text-base font-semibold        
  text-white">
                                              {testimonial.name.split(' ').map(n => n[0]).join('')}  
                                          </span>
                                      </div>
                                      <div>
                                          <p className="text-sm sm:text-base font-semibold
  text-gray-900">{testimonial.name}</p>
                                          <p className="text-xs sm:text-sm text-gray-500">
                                              {testimonial.role} at {testimonial.company}
                                          </p>
                                      </div>
                                  </div>
                              </Card>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      );
  }