 'use client';

  import { motion } from 'framer-motion';
  import Logo from './Logo';

  export default function PageLoader() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Logo size="lg" showText={false} />
          </motion.div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }