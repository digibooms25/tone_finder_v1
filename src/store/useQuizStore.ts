import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { questions } from '../lib/questions';
import { scoreFreeTextResponse, OpenAIQuotaError } from '../lib/openai';

type ToneTraits = {
  formality: number;
  brevity: number;
  humor: number;
  warmth: number;
  directness: number;
  expressiveness: number;
};

type QuizState = {
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  traits: ToneTraits;
  isComplete: boolean;
  error: string | null;
  
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  calculateTraits: () => Promise<ToneTraits>;
  updateTraits: (traits: ToneTraits) => void;
  resetQuiz: () => void;
  setError: (error: string | null) => void;
};

const initialTraits: ToneTraits = {
  formality: 0,
  brevity: 0,
  humor: 0,
  warmth: 0,
  directness: 0,
  expressiveness: 0,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      answers: {},
      traits: { ...initialTraits },
      isComplete: false,
      error: null,
      
      nextQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
          set({ isComplete: true });
        }
      },
      
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },
      
      goToQuestion: (index: number) => {
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      setCurrentQuestionIndex: (index: number) => {
        set({ currentQuestionIndex: index });
      },
      
      setAnswer: (questionId: string, answer: string | string[]) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        }));
      },

      setError: (error: string | null) => {
        set({ error });
      },
      
      calculateTraits: async () => {
        const { answers } = get();
        set({ error: null });
        
        const traitScores: Record<keyof ToneTraits, number[]> = {
          formality: [],
          brevity: [],
          humor: [],
          warmth: [],
          directness: [],
          expressiveness: [],
        };
        
        try {
          // Process choice and multi_select questions
          for (const question of questions) {
            const answer = answers[question.id];
            if (!answer) continue;
            
            if (question.type === 'choice') {
              const selectedOption = question.options[answer as string];
              if (selectedOption?.weights) {
                Object.entries(selectedOption.weights).forEach(([trait, value]) => {
                  const traitKey = trait as keyof ToneTraits;
                  if (traitKey in traitScores) {
                    traitScores[traitKey].push(value);
                  }
                });
              }
            } 
            else if (question.type === 'multi_select') {
              const selectedOptions = answer as string[];
              selectedOptions.forEach(option => {
                const weights = question.options[option];
                if (weights) {
                  Object.entries(weights).forEach(([trait, value]) => {
                    const traitKey = trait as keyof ToneTraits;
                    if (traitKey in traitScores) {
                      traitScores[traitKey].push(value);
                    }
                  });
                }
              });
            }
          }
          
          // Process free text questions
          for (const question of questions) {
            if (question.type === 'freeText') {
              const text = answers[question.id] as string;
              if (text) {
                try {
                  const scores = await scoreFreeTextResponse(text);
                  Object.entries(scores).forEach(([trait, value]) => {
                    const traitKey = trait as keyof ToneTraits;
                    if (traitKey in traitScores) {
                      traitScores[traitKey].push(value);
                    }
                  });
                } catch (error) {
                  if (error instanceof OpenAIQuotaError) {
                    set({ 
                      error: 'OpenAI API quota exceeded. Please try again in a few minutes.',
                      isComplete: false 
                    });
                    throw error;
                  }
                  console.error('Error scoring free text:', error);
                }
              }
            }
          }
          
          // Calculate final trait values
          const calculatedTraits: ToneTraits = { ...initialTraits };
          
          Object.entries(traitScores).forEach(([trait, scores]) => {
            const traitKey = trait as keyof ToneTraits;
            if (scores.length > 0) {
              const sum = scores.reduce((acc, val) => acc + val, 0);
              const avg = sum / scores.length;
              calculatedTraits[traitKey] = Math.max(-1, Math.min(1, avg));
            }
          });
          
          set({ traits: calculatedTraits });
          return calculatedTraits;
        } catch (error) {
          if (error instanceof OpenAIQuotaError) {
            throw error;
          }
          console.error('Error calculating traits:', error);
          throw error;
        }
      },
      
      updateTraits: (traits: ToneTraits) => {
        set((state) => ({
          traits: traits,
          isComplete: true
        }));
      },
      
      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: {},
          isComplete: false,
          traits: { ...initialTraits },
          error: null,
        });
      },
    }),
    {
      name: 'tone-quiz',
    }
  )
);