import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToneProfile } from '../lib/supabase';
import Button from './Button';
import { MoreVertical, Edit2, Trash2, Copy, Files, ChevronDown, ChevronUp } from 'lucide-react';

interface ToneCardProps {
  tone: ToneProfile;
  onDelete: (id: string) => Promise<void>;
  onCopyPrompt: (prompt: string) => void;
  onDuplicate: (id: string) => Promise<void>;
  onEdit?: (tone: ToneProfile) => void;
}

const ToneCard: React.FC<ToneCardProps> = ({ 
  tone, 
  onDelete, 
  onCopyPrompt, 
  onDuplicate,
  onEdit 
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${tone.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(tone.id);
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    }
  };
  
  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate(tone.id);
    } finally {
      setIsDuplicating(false);
      setShowMenu(false);
    }
  };
  
  const handleCopyPrompt = () => {
    onCopyPrompt(tone.prompt);
    setShowMenu(false);
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(tone);
      setShowMenu(false);
    }
  };
  
  // Create a visualization of the tone traits
  const traitBars = [
    { name: 'Formality', value: tone.formality },
    { name: 'Brevity', value: tone.brevity },
    { name: 'Humor', value: tone.humor },
    { name: 'Warmth', value: tone.warmth },
    { name: 'Directness', value: tone.directness },
    { name: 'Expressiveness', value: tone.expressiveness },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{tone.name}</h3>
          <span className="text-xs text-gray-500">{formatDate(tone.created_at)}</span>
        </div>
        <div className="relative">
          <Button
            variant="text"
            size="sm"
            icon={<MoreVertical size={16} />}
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-blue-600"
          />
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
              >
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                )}
                <button
                  onClick={handleCopyPrompt}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy size={14} />
                  Copy Prompt
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Files size={14} />
                  {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mb-6 space-y-2">
        {traitBars.map((trait) => (
          <div key={trait.name} className="flex items-center text-sm">
            <span className="w-32 text-gray-600">{trait.name}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ 
                  width: `${((trait.value + 1) / 2) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <Button
        variant="text"
        size="sm"
        className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600"
        onClick={() => setShowPrompt(!showPrompt)}
      >
        <span>{showPrompt ? 'Hide Prompt' : 'View Prompt'}</span>
        {showPrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 mt-2">
              {tone.prompt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToneCard;