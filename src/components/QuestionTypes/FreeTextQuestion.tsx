import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FreeTextQuestion as FreeTextQuestionType } from '../../lib/questions';
import Button from '../Button';

interface FreeTextQuestionProps {
  question: FreeTextQuestionType;
  savedAnswer?: string;
  onAnswerSubmitted: (questionId: string, answer: string) => void;
}

const FreeTextQuestion: React.FC<FreeTextQuestionProps> = ({
  question,
  savedAnswer,
  onAnswerSubmitted,
}) => {
  const [answer, setAnswer] = useState(savedAnswer || '');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (savedAnswer) {
      setAnswer(savedAnswer);
      countWords(savedAnswer);
    }
  }, [savedAnswer]);
  
  const countWords = (text: string) => {
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() === '' ? 0 : words.length);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswer(text);
    countWords(text);
  };
  
  const handleSubmit = () => {
    if (answer.trim()) {
      setIsSubmitting(true);
      onAnswerSubmitted(question.id, answer);
      setIsSubmitting(false);
    }
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
      
      <div className="mb-4">
        <textarea
          value={answer}
          onChange={handleChange}
          placeholder="Type your response here..."
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className={`${wordCount > 50 ? 'text-red-500' : 'text-gray-500'}`}>
            {wordCount} words {wordCount > 50 ? '(exceeds limit)' : ''}
          </span>
        </div>
      </div>
      
      <Button
        onClick={handleSubmit}
        disabled={!answer.trim() || wordCount > 50}
        isLoading={isSubmitting}
      >
        {savedAnswer ? 'Update Answer' : 'Submit Answer'}
      </Button>
    </motion.div>
  );
};

export default FreeTextQuestion;