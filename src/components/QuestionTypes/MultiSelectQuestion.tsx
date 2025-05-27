import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MultiSelectQuestion as MultiSelectQuestionType } from '../../lib/questions';
import Button from '../Button';

interface MultiSelectQuestionProps {
  question: MultiSelectQuestionType;
  savedSelections?: string[];
  onSelectionsSubmitted: (questionId: string, selections: string[]) => void;
}

const MultiSelectQuestion: React.FC<MultiSelectQuestionProps> = ({
  question,
  savedSelections = [],
  onSelectionsSubmitted,
}) => {
  const [selections, setSelections] = useState<string[]>(savedSelections);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    setSelections(savedSelections);
  }, [savedSelections]);
  
  const toggleOption = (optionKey: string) => {
    const newSelections = selections.includes(optionKey)
      ? selections.filter(key => key !== optionKey)
      : selections.length < question.maxSelections
        ? [...selections, optionKey]
        : selections;
    
    setSelections(newSelections);
    onSelectionsSubmitted(question.id, newSelections);
  };
  
  const formatOptionText = (key: string) => {
    return key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{question.prompt}</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select up to {question.maxSelections} options
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {Object.keys(question.options).map((key) => {
          const isSelected = selections.includes(key);
          const isDisabled = !isSelected && selections.length >= question.maxSelections;
          
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleOption(key)}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all duration-200
                text-left cursor-pointer select-none
                ${isSelected 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              disabled={isDisabled && !isSelected}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {formatOptionText(key)}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {selections.length} of {question.maxSelections} selected
        </span>
      </div>
    </motion.div>
  );
};

export default MultiSelectQuestion;