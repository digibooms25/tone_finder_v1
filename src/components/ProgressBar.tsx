import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onClickStep?: (step: number) => void;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  onClickStep,
  className = '',
}) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;
  
  return (
    <div className={`w-full ${className}`}>      
      <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {onClickStep && (
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onClickStep(index)}
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index <= currentStep
                    ? 'bg-blue-600 shadow-lg'
                    : 'bg-gray-300'
                } group-hover:scale-110`}
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                  Question {index + 1}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;