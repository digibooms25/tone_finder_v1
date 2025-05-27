import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyzingLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    {
      title: "Analyzing Responses",
      description: "Processing your communication patterns and preferences...",
      duration: 2000,
      target: 25
    },
    {
      title: "Detecting Style",
      description: "Identifying your unique writing characteristics...",
      duration: 2000,
      target: 50
    },
    {
      title: "Mapping Traits",
      description: "Building your personalized tone profile...",
      duration: 2000,
      target: 75
    },
    {
      title: "Generating Results",
      description: "Creating tailored writing examples and recommendations...",
      duration: 2000,
      target: 98
    }
  ];

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    let intervalId: NodeJS.Timeout;

    // Start with a delay to show initial state
    timeoutIds.push(setTimeout(() => {
      // Progress animation for each phase
      phases.forEach((phase, index) => {
        const startTime = phases.slice(0, index).reduce((acc, p) => acc + p.duration, 0);
        const previousTarget = index > 0 ? phases[index - 1].target : 0;
        
        timeoutIds.push(setTimeout(() => {
          setCurrentPhase(index);
          
          // Smooth progress animation within each phase
          const startProgress = previousTarget;
          const endProgress = phase.target;
          const duration = phase.duration;
          const steps = duration / 50; // Update every 50ms
          const increment = (endProgress - startProgress) / steps;
          
          intervalId = setInterval(() => {
            setProgress(prev => {
              const next = prev + increment;
              return next > endProgress ? endProgress : next;
            });
          }, 50);
          
          // Clear interval at the end of this phase
          timeoutIds.push(setTimeout(() => {
            clearInterval(intervalId);
          }, duration));
          
        }, startTime));
      });
    }, 500));

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      clearInterval(intervalId);
    };
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
          <div className="relative h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
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
          <div className="flex justify-center gap-3 mt-6">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentPhase ? 'bg-blue-600' :
                  index < currentPhase ? 'bg-blue-400' : 'bg-gray-200'
                }`}
                animate={{
                  scale: index === currentPhase ? [1, 1.2, 1] : 1,
                  opacity: index === currentPhase ? 1 : 0.7
                }}
                transition={{
                  duration: 1,
                  repeat: index === currentPhase ? Infinity : 0,
                  ease: "easeInOut"
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