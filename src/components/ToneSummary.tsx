import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Edit2, Check, X } from 'lucide-react';

interface ToneSummaryProps {
  title: string;
  summary: string;
  onSave?: (name: string) => Promise<void>;
  isLoading?: boolean;
  showSave?: boolean;
  defaultName?: string;
  isEditing?: boolean;
}

const ToneSummary: React.FC<ToneSummaryProps> = ({ 
  title, 
  summary,
  onSave,
  isLoading,
  showSave = false,
  defaultName,
  isEditing = false,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [toneName, setToneName] = useState(defaultName || title);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (onSave && toneName.trim()) {
      await onSave(toneName);
      setIsRenaming(false);
    }
  };

  const handleCancel = () => {
    setToneName(defaultName || title);
    setIsRenaming(false);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isRenaming ? (
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={toneName}
            onChange={(e) => setToneName(e.target.value)}
            className="flex-1 px-4 py-2 text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            autoFocus
            required
          />
          <button
            onClick={() => handleSubmit()}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
            title="Save"
          >
            <Check size={20} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            title="Cancel"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {title || 'The Balanced Communicator'}
          </h2>
          {showSave && (
            <button
              onClick={() => setIsRenaming(true)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full transition-colors"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      )}
      
      <p className="text-gray-600 text-sm mb-4">
        {isEditing 
          ? 'Fine-tune your tone settings and see how they affect your writing style.'
          : 'A detailed breakdown of your unique tone and communication patterns.'}
      </p>
      
      {summary ? (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
          
          {showSave && !isRenaming && (
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Save Tone
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p className="text-gray-500">Your tone summary will appear here after you complete the test and generate results.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ToneSummary;