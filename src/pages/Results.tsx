import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/useQuizStore';
import { useToneStore } from '../store/useToneStore';
import { useAuthStore } from '../store/useAuthStore';
import ToneSummary from '../components/ToneSummary';
import ToneAdjuster from '../components/ToneAdjuster';
import TonePreview from '../components/TonePreview';
import CopyPromptButton from '../components/CopyPromptButton';
import Button from '../components/Button';
import AuthForm from '../components/AuthForm';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { toneId } = useParams();
  const { traits: quizTraits, resetQuiz } = useQuizStore();
  const { 
    currentTone,
    loading,
    error,
    isQuotaExceeded,
    generateContent,
    saveTone,
    setCurrentToneTraits,
    clearError,
    setPendingSave,
  } = useToneStore();
  const { user } = useAuthStore();
  
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [pendingName, setPendingName] = useState<string | null>(null);
  
  const handleTraitsChange = async (traits: typeof quizTraits) => {
    setCurrentToneTraits(traits);
  };
  
  const handleRegenerate = async () => {
    clearError();
    try {
      await generateContent();
    } catch (error) {
      console.error('Error regenerating content:', error);
    }
  };
  
  const handleSaveTone = async (name: string) => {
    if (user) {
      await saveTone(name, user.id);
      navigate('/dashboard');
    } else {
      setPendingName(name);
      setPendingSave(true);
      setShowAuthForm(true);
      setAuthMode('signup');
    }
  };
  
  const handleStartOver = () => {
    resetQuiz();
    navigate('/quiz');
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        {toneId && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </motion.button>
        )}
        
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-4"
          >
            <Wand2 className="text-purple-500 mr-2" size={18} />
            <span className="text-gray-600">
              {toneId ? 'Fine-tune Your Tone' : 'Your Results Are Ready'}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {toneId ? (
              'Edit Your Tone'
            ) : (
              <span>
                Your Writing Voice
                <motion.span
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              </span>
            )}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {toneId 
              ? 'Adjust the sliders to fine-tune your tone and see how it changes your writing style.'
              : 'Here\'s what we\'ve discovered about your unique communication style. Use the controls to perfect your tone.'}
          </motion.p>
        </header>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl shadow-lg"
          >
            <p className="text-red-700">{error}</p>
            {isQuotaExceeded && (
              <p className="mt-2 text-red-600">
                The AI service is currently unavailable due to high demand. Please try again in a few minutes.
              </p>
            )}
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ToneSummary 
              title={currentTone.title} 
              summary={currentTone.summary}
              onSave={!toneId ? handleSaveTone : undefined}
              isLoading={loading}
              showSave={!toneId && currentTone.summary !== ''}
              defaultName={currentTone.title}
              isEditing={!!toneId}
            />
            <TonePreview examples={currentTone.examples} />
            <CopyPromptButton prompt={currentTone.prompt} />
          </div>
          
          <div>
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
              isLoading={loading}
            />
          </div>
        </div>
        
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            onClick={handleStartOver}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            Take the Test Again
          </Button>
        </motion.div>
        
        {showAuthForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAuthForm(false);
                      setPendingSave(false);
                      setPendingName(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <AuthForm 
                  mode={authMode} 
                  setShowAuthModal={setShowAuthForm}
                />
                
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