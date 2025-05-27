import React from 'react';
import { motion } from 'framer-motion';
import { ChoiceQuestion as ChoiceQuestionType } from '../../lib/questions';

interface ChoiceQuestionProps {
  question: ChoiceQuestionType;
  selectedAnswer?: string;
  onAnswerSelected: (questionId: string, answer: string) => void;
}

const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelected,
}) => {
  const handleOptionClick = (optionKey: string) => {
    onAnswerSelected(question.id, optionKey);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-6 text-gray-800">{question.prompt}</h3>
      
      <div className="space-y-3">
        {Object.entries(question.options).map(([key, option]) => (
          <motion.button
            key={key}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === key
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleOptionClick(key)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedAnswer === key
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-400'
                }`}
              >
                {selectedAnswer === key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
              <span className="text-gray-800">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChoiceQuestion;