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

  const getBackgroundStyle = () => {
    const percentage = getPercentage();
    return {
      background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%)`,
    };
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
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{getFormattedValue()}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
            {getLabelByValue()}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <motion.input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={getBackgroundStyle()}
          whileTap={{ scale: 1.03 }}
          whileHover={{ scale: 1.01 }}
        />
        
        {displayLabels && (
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{displayLabels[0]}</span>
            <span>Balanced</span>
            <span>{displayLabels[1]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;