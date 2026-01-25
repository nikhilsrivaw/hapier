 'use client';

  import { motion } from 'framer-motion';
  import { Badge } from '@/components/ui/badge';

  const integrations = [
      { name: 'Slack', color: 'bg-purple-100 text-purple-600' },
      { name: 'Google', color: 'bg-blue-100 text-blue-600' },
      { name: 'Zoho', color: 'bg-red-100 text-red-600' },
      { name: 'Tally', color: 'bg-green-100 text-green-600' },
      { name: 'WhatsApp', color: 'bg-emerald-100 text-emerald-600' },
      { name: 'Razorpay', color: 'bg-cyan-100 text-cyan-600' },
      { name: 'Excel', color: 'bg-green-100 text-green-700' },
      { name: 'Biometric', color: 'bg-orange-100 text-orange-600' },
  ];

  export default function Integrations() {
      return (
          <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white     
  overflow-hidden">
              <div className="max-w-5xl mx-auto">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mb-10 sm:mb-12"
                  >
                      <Badge className="mb-3 sm:mb-4 bg-cyan-100 text-cyan-700 border-0 px-3 sm:px-4 
  py-1 sm:py-1.5 text-xs sm:text-sm">
                          Integrations
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3   
  sm:mb-4">
                          Works with your{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r
  from-cyan-600 to-blue-500">
                              favorite tools
                          </span>
                      </h2>
                      <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                          Connect Hapier with the tools you already use. No switching required.      
                      </p>
                  </motion.div>

                  {/* Integration Pills */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap justify-center gap-3 sm:gap-4"
                  >
                      {integrations.map((integration, index) => (
                          <motion.div
                              key={integration.name}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className={`${integration.color} px-4 sm:px-6 py-2 sm:py-3 rounded-full
   font-medium text-sm sm:text-base cursor-pointer shadow-sm hover:shadow-md transition-all`}        
                          >
                              {integration.name}
                          </motion.div>
                      ))}
                  </motion.div>

                  {/* Coming Soon */}
                  <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8"
                  >
                      + More integrations coming soon. Have a request?{' '}
                      <span className="text-rose-600 hover:text-rose-700 cursor-pointer
  font-medium">Let us know</span>
                  </motion.p>
              </div>
          </section>
      );
  }