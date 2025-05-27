import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  displayLabels?: [string, string];
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = -1,
  max = 1,
  step = 0.01,
  onChange,
  displayLabels,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = () => {
    return ((localValue - min) / (max - min)) * 100;
  };

  const getTrackColor = () => {
    const percentage = getPercentage();
    if (percentage < 33) return 'from-blue-400 to-blue-600';
    if (percentage > 66) return 'from-purple-400 to-purple-600';
    return 'from-indigo-400 to-indigo-600';
  };

  const getFormattedValue = () => {
    return localValue.toFixed(2);
  };

  const getLabelByValue = () => {
    if (!displayLabels) return '';
    
    if (localValue < -0.33) {
      return displayLabels[0];
    } else if (localValue > 0.33) {
      return displayLabels[1];
    } else {
      return 'Balanced';
    }
  };

  const getBadgeColor = () => {
    const percentage = getPercentage();
    if (percentage < 33) return 'bg-blue-100 text-blue-800';
    if (percentage > 66) return 'bg-purple-100 text-purple-800';
    return 'bg-indigo-100 text-indigo-800';
  };

  return (
    <motion.div 
      className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-sm text-gray-500"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {getFormattedValue()}
          </motion.span>
          <motion.span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeColor()}`}
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            {getLabelByValue()}
          </motion.span>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full" />
        <div 
          className={`absolute h-full bg-gradient-to-r ${getTrackColor()} rounded-full`}
          style={{ width: `${getPercentage()}%` }}
        />
        <motion.input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
          style={{
            WebkitAppearance: 'none',
            background: 'transparent',
          }}
          css={{
            '&::-webkit-slider-thumb': {
              WebkitAppearance: 'none',
              appearance: 'none',
              width: '16px',
              height: '16px',
              background: 'white',
              border: '2px solid rgb(99, 102, 241)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            '&::-webkit-slider-thumb:hover': {
              transform: 'scale(1.2)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            '&::-moz-range-thumb': {
              width: '16px',
              height: '16px',
              background: 'white',
              border: '2px solid rgb(99, 102, 241)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            '&::-moz-range-thumb:hover': {
              transform: 'scale(1.2)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        
        {displayLabels && (
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{displayLabels[0]}</span>
            <span>Balanced</span>
            <span>{displayLabels[1]}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Slider;