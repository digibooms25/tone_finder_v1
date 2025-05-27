import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const AnalyzingLoader: React.FC = () => {
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brainVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: [0, 1, 0.5],
      y: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const messages = [
    "Analyzing writing patterns...",
    "Detecting tone preferences...",
    "Processing communication style...",
    "Identifying unique traits...",
    "Generating personalized insights..."
  ];

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-blue-200 rounded-full blur-xl"
            />
            <motion.div 
              variants={brainVariants}
              initial="initial"
              animate="animate"
              className="relative bg-blue-600 text-white p-6 rounded-full transform-gpu"
            >
              <Brain size={48} />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Analyzing Your Responses
        </motion.h2>
        
        <div className="h-6 overflow-hidden">
          {messages.map((message, index) => (
            <motion.p
              key={index}
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [-20, 0, 20]
              }}
              transition={{
                duration: 3,
                delay: index * 3,
                repeat: Infinity,
                repeatDelay: messages.length * 3 - 3
              }}
              className="text-gray-600"
            >
              {message}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyzingLoader;