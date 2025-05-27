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
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {onClickStep && (
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              onClick={() => onClickStep(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index <= currentStep
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;