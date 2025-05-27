import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questions } from '../lib/questions';
import ProgressBar from '../components/ProgressBar';
import ChoiceQuestion from '../components/QuestionTypes/ChoiceQuestion';
import FreeTextQuestion from '../components/QuestionTypes/FreeTextQuestion';
import MultiSelectQuestion from '../components/QuestionTypes/MultiSelectQuestion';
import AnalyzingLoader from '../components/AnalyzingLoader';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { useToneStore } from '../store/useToneStore';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentQuestionIndex, 
    answers, 
    isComplete,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    setAnswer,
    calculateTraits,
  } = useQuizStore();
  const { resetCurrentTone } = useToneStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Reset current tone when starting a new quiz
  useEffect(() => {
    resetCurrentTone();
  }, []);
  
  useEffect(() => {
    if (isComplete) {
      handleComplete();
    }
  }, [isComplete]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const handleAnswerSelected = (questionId: string, answer: string) => {
    setAnswer(questionId, answer);
  };
  
  const handleSelectionsSubmitted = (questionId: string, selections: string[]) => {
    setAnswer(questionId, selections);
  };
  
  const handleNext = () => {
    nextQuestion();
  };
  
  const handlePrevious = () => {
    previousQuestion();
  };
  
  const handleComplete = async () => {
    setIsAnalyzing(true);
    try {
      await calculateTraits();
      // Add a minimum delay to ensure loader is visible
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/results');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    switch (currentQuestion.type) {
      case 'choice':
        return (
          <ChoiceQuestion
            question={currentQuestion}
            selectedAnswer={currentAnswer as string}
            onAnswerSelected={handleAnswerSelected}
          />
        );
      case 'freeText':
        return (
          <FreeTextQuestion
            question={currentQuestion}
            savedAnswer={currentAnswer as string}
            onAnswerSubmitted={handleAnswerSelected}
          />
        );
      case 'multi_select':
        return (
          <MultiSelectQuestion
            question={currentQuestion}
            savedSelections={currentAnswer as string[]}
            onSelectionsSubmitted={handleSelectionsSubmitted}
          />
        );
      default:
        return null;
    }
  };
  
  const canContinue = !!currentAnswer;
  
  return (
    <>
      {isAnalyzing && <AnalyzingLoader />}
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <ProgressBar
              currentStep={currentQuestionIndex}
              totalSteps={questions.length}
              onClickStep={goToQuestion}
            />
          </div>
          
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {renderQuestion()}
          </motion.div>
          
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              icon={<ChevronLeft size={18} />}
            >
              Previous
            </Button>
            
            <Button
              onClick={isLastQuestion ? handleComplete : handleNext}
              disabled={!canContinue}
              icon={isLastQuestion ? <CheckCircle size={18} /> : <ChevronRight size={18} />}
              iconPosition={isLastQuestion ? 'left' : 'right'}
            >
              {isLastQuestion ? 'Complete Test' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;