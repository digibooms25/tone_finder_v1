import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToneStore } from '../store/useToneStore';
import { useAuthStore } from '../store/useAuthStore';
import ToneCard from '../components/ToneCard';
import Button from '../components/Button';
import { PlusCircle, Sparkles } from 'lucide-react';

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
  
  const handleNewTone = () => {
    navigate('/quiz');
  };

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-white rounded-lg shadow-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto px-6"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={24} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Discover Your Writing Voice
        </h2>
        <p className="text-gray-600 mb-8">
          Take our quick tone test to understand your unique writing style. Get personalized insights and a custom prompt you can use with any AI writing assistant.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={handleNewTone}
            size="lg"
            className="w-full sm:w-auto"
            icon={<PlusCircle size={20} />}
          >
            Start Tone Test
          </Button>
        </div>
      </motion.div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user ? 'Your Saved Tones' : 'Writing Tone Dashboard'}
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Create, manage, or modify your unique writing styles. 
Each tone includes a tailored prompt, enabling AI writing assistants to perfectly replicate your style. 
You can easily copy these prompts for use with any AI writing tool.
            </p>
          </div>
          
          <Button
            variant="primary"
            icon={<PlusCircle size={18} />}
            onClick={handleNewTone}
          >
            New Tone
          </Button>
        </div>
        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 text-green-800 p-4 rounded-md mb-6"
          >
            {message}
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : user && savedTones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTones.map((tone) => (
              <motion.div
                key={tone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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