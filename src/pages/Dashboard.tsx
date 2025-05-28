import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToneStore } from '../store/useToneStore';
import { useAuthStore } from '../store/useAuthStore';
import ToneCard from '../components/ToneCard';
import Button from '../components/Button';
import { PlusCircle, Sparkles, Brain, Wand2, ChevronDown, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    savedTones, 
    loadSavedTones, 
    deleteTone, 
    duplicateTone,
    updateTone,
    loading, 
    setCurrentToneFromProfile 
  } = useToneStore();
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadSavedTones(user.id);
    }
  }, [user]);
  
  const handleDelete = async (id: string) => {
    await deleteTone(id);
  };
  
  const handleDuplicate = async (id: string) => {
    if (!user) return;
    await duplicateTone(id, user.id);
    setMessage('Tone duplicated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setMessage('Prompt copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleEdit = (tone: ToneProfile) => {
    setCurrentToneFromProfile(tone);
    navigate(`/edit/${tone.id}`);
  };

  const handleRename = async (id: string, newName: string) => {
    await updateTone(id, { name: newName });
    setMessage('Tone renamed successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleOptionSelect = (path: string) => {
    setShowDropdown(false);
    navigate(path);
  };
  
  const handleNewTone = () => {
    navigate('/quiz');
  };

  const renderEmptyState = () => (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
      <div className="relative px-6 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-8 transform -rotate-6 shadow-lg">
            <Brain size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Your Writing Voice
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Take our quick tone test to understand your unique writing style. Get personalized insights and a custom prompt you can use with any AI writing assistant.
          </p>
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleNewTone}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
                icon={<PlusCircle size={20} />}
              >
                Start Tone Test
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-4">
                <Wand2 className="text-purple-500 mr-2" size={18} />
                <span className="text-gray-600">
                  {user ? 'Your Tone Collection' : 'Writing Tone Dashboard'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {user ? (
                  <span>
                    Your Saved Tones
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ✨
                    </motion.span>
                  </span>
                ) : (
                  'Writing Tone Dashboard'
                )}
              </h1>
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                Create, manage, and modify your unique writing styles. Each tone includes a tailored prompt, enabling AI writing assistants to perfectly replicate your style.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Button
              variant="primary"
              icon={<PlusCircle size={18} />}
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg flex items-center gap-2"
            >
              New Tone
              <ChevronDown size={16} className={`ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                >
                  <button
                    onClick={() => handleOptionSelect('/quiz')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Brain size={16} />
                    Tone Test
                  </button>
                  <button
                    onClick={() => handleOptionSelect('/text')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Text Analysis
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white/80 backdrop-blur-sm text-blue-800 p-4 rounded-xl mb-6 border border-blue-100 shadow-lg"
          >
            {message}
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          </div>
        ) : user && savedTones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTones.map((tone, index) => (
              <motion.div
                key={tone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ToneCard
                  tone={tone}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onCopyPrompt={handleCopyPrompt}
                  onEdit={handleEdit}
                  onRename={handleRename}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default Dashboard;