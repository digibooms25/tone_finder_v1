import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questions } from '../lib/questions';
import ProgressBar from '../components/ProgressBar';
import ChoiceQuestion from '../components/QuestionTypes/ChoiceQuestion';
import FreeTextQuestion from '../components/QuestionTypes/FreeTextQuestion';
import MultiSelectQuestion from '../components/QuestionTypes/MultiSelectQuestion';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { useToneStore } from '../store/useToneStore';
import { ChevronLeft, ChevronRight, CheckCircle, Brain } from 'lucide-react';
import AnalyzingLoader from '../components/AnalyzingLoader';

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
    setCurrentQuestionIndex,
  } = useQuizStore();
  const { resetCurrentTone } = useToneStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    resetCurrentTone();
    setCurrentQuestionIndex(0);
  }, []);
  
  useEffect(() => {
    if (isComplete && !isAnalyzing) {
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
      navigate('/results', { state: { fromQuiz: true } });
    } catch (error) {
      console.error('Error calculating traits:', error);
      setIsAnalyzing(false);
    }
  };
  
  if (isAnalyzing) {
    return <AnalyzingLoader />;
  }
  
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-8"
        >
          <Brain className="text-blue-600 mr-2" size={18} />
          <span className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </motion.div>

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
          {currentQuestionIndex > 0 ? (
            <button
              onClick={handlePrevious}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              <span>Previous</span>
            </button>
          ) : (
            <div className="w-20" />
          )}
          
          <Button
            onClick={isLastQuestion ? handleComplete : handleNext}
            disabled={!canContinue}
            icon={isLastQuestion ? <CheckCircle size={18} /> : <ChevronRight size={18} />}
            iconPosition={isLastQuestion ? 'left' : 'right'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isLastQuestion ? 'Complete Test' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;