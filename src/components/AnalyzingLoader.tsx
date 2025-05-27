import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyzingLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    {
      title: "Pattern Analysis",
      description: "Analyzing your communication patterns and preferences...",
      duration: 1500
    },
    {
      title: "Style Detection",
      description: "Identifying your unique writing style markers...",
      duration: 1500
    },
    {
      title: "Trait Mapping",
      description: "Mapping your responses to tone characteristics...",
      duration: 1500
    },
    {
      title: "Profile Generation",
      description: "Creating your personalized tone profile...",
      duration: 1500
    }
  ];

  useEffect(() => {
    const totalDuration = phases.reduce((acc, phase) => acc + phase.duration, 0);
    const increment = 100 / totalDuration;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 50);

    phases.forEach((phase, index) => {
      setTimeout(() => {
        setCurrentPhase(index);
      }, phases.slice(0, index).reduce((acc, p) => acc + p.duration, 0));
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Phase Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${currentPhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-bold text-gray-900 mb-3 text-center"
            >
              {phases[currentPhase].title}
            </motion.h2>
          </AnimatePresence>

          {/* Phase Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentPhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-600 text-center mb-6"
            >
              {phases[currentPhase].description}
            </motion.p>
          </AnimatePresence>

          {/* Progress Percentage */}
          <div className="text-center text-sm font-medium text-gray-500">
            {Math.round(progress)}% Complete
          </div>

          {/* Visual Progress Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentPhase ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                animate={{
                  scale: index === currentPhase ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: index === currentPhase ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzingLoader;