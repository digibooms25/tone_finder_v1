import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyzingLoader: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    {
      title: "Analyzing Responses",
      description: "Processing your communication patterns..."
    },
    {
      title: "Detecting Style",
      description: "Identifying your unique characteristics..."
    },
    {
      title: "Building Profile",
      description: "Creating your personalized tone map..."
    },
    {
      title: "Generating Results",
      description: "Crafting your custom recommendations..."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(current => (current + 1) % phases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative"
        >
          {/* Circular Loader */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 border-4 border-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                style={{ borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-gradient-to-r from-blue-400 to-blue-300 rounded-full"
                style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-gradient-to-r from-blue-300 to-blue-200 rounded-full"
                style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </div>

          {/* Phase Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${currentPhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-3"
            >
              <motion.div
                className="inline-flex items-center bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <span className="text-blue-800 font-medium">
                  {phases[currentPhase].title}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Phase Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentPhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-600 text-center"
            >
              {phases[currentPhase].description}
            </motion.p>
          </AnimatePresence>

          {/* Phase Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhase 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
                    : 'bg-gray-200'
                }`}
                animate={{
                  scale: index === currentPhase ? [1, 1.2, 1] : 1
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