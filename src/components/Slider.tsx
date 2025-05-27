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

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-sm text-gray-500"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {getFormattedValue()}
          </motion.span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
            {getLabelByValue()}
          </span>
        </div>
      </div>
      
      <div className="relative h-[15px] flex items-center">
        <div className="absolute w-full h-[2px] bg-gray-200 rounded-full" />
        <div 
          className="absolute h-[2px] bg-blue-600 rounded-full"
          style={{ width: `${getPercentage()}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-sm"
          style={{ left: `${getPercentage()}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      {displayLabels && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{displayLabels[0]}</span>
          <span>Balanced</span>
          <span>{displayLabels[1]}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;