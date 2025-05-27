import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/useQuizStore';
import { useToneStore } from '../store/useToneStore';
import { useAuthStore } from '../store/useAuthStore';
import ToneSummary from '../components/ToneSummary';
import ToneAdjuster from '../components/ToneAdjuster';
import TonePreview from '../components/TonePreview';
import CopyPromptButton from '../components/CopyPromptButton';
import SaveToneForm from '../components/SaveToneForm';
import Button from '../components/Button';
import AuthForm from '../components/AuthForm';
import AnalyzingLoader from '../components/AnalyzingLoader';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { toneId } = useParams();
  const { traits: quizTraits, resetQuiz } = useQuizStore();
  const { 
    currentTone,
    loading,
    generateContent,
    saveTone,
    setCurrentToneTraits,
  } = useToneStore();
  const { user } = useAuthStore();
  
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Set initial tone traits from quiz results when creating new tone
  useEffect(() => {
    if (!toneId) {
      setCurrentToneTraits(quizTraits);
    }
  }, [quizTraits, toneId]);
  
  // Generate initial results only for new tones
  useEffect(() => {
    const generateInitialResults = async () => {
      if (!toneId && !currentTone.summary) {
        setIsGenerating(true);
        try {
          await generateContent();
        } finally {
          setIsGenerating(false);
        }
      }
    };
    
    generateInitialResults();
  }, [toneId]);
  
  const handleTraitsChange = (traits: typeof quizTraits) => {
    setCurrentToneTraits(traits);
  };
  
  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      await generateContent();
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveTone = async (name: string) => {
    if (user) {
      await saveTone(name, user.id);
      navigate('/dashboard');
    } else {
      setShowAuthForm(true);
      setAuthMode('signup');
    }
  };
  
  const handleAuthSuccess = async () => {
    setShowAuthForm(false);
  };
  
  const handleStartOver = () => {
    resetQuiz();
    navigate('/quiz');
  };
  
  const handleSkipToHome = () => {
    navigate('/');
  };
  
  if (isGenerating) {
    return <AnalyzingLoader />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-12">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {toneId ? 'Edit Your Tone' : 'Your Writing Tone Results'}
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {toneId 
              ? 'Adjust the sliders to fine-tune your tone and see how it changes.'
              : 'Here\'s what we\'ve discovered about your writing style. Adjust the sliders to fine-tune your tone.'
            }
          </motion.p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <ToneSummary title={currentTone.title} summary={currentTone.summary} />
            <TonePreview examples={currentTone.examples} />
            <CopyPromptButton prompt={currentTone.prompt} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <ToneAdjuster
              traits={{
                formality: currentTone.formality,
                brevity: currentTone.brevity,
                humor: currentTone.humor,
                warmth: currentTone.warmth,
                directness: currentTone.directness,
                expressiveness: currentTone.expressiveness,
              }}
              onTraitsChange={handleTraitsChange}
              onRegenerate={handleRegenerate}
              isLoading={loading || isGenerating}
            />
            
            {user ? (
              <SaveToneForm onSave={handleSaveTone} isLoading={loading} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Save Your Tone</h3>
                <p className="text-gray-600 mb-6">
                  Create an account to save your tone and access it anytime.
                </p>
                <Button
                  onClick={() => {
                    setShowAuthForm(true);
                    setAuthMode('signup');
                  }}
                  className="w-full"
                >
                  Sign Up to Save
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Button variant="outline" onClick={handleStartOver}>
            Take the Test Again
          </Button>
          <Button variant="secondary" onClick={handleSkipToHome}>
            Return to Home
          </Button>
        </div>
        
        {showAuthForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <button
                    onClick={() => setShowAuthForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
                
                <div className="mt-4 text-center text-sm">
                  {authMode === 'signin' ? (
                    <p>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        onClick={() => setAuthMode('signin')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;