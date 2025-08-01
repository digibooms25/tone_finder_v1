import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToneProfile } from '../lib/supabase';
import Button from './Button';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { MoreVertical, Edit2, Trash2, Copy, Files, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface ToneCardProps {
  tone: ToneProfile;
  onDelete: (id: string) => Promise<void>;
  onCopyPrompt: (prompt: string) => void;
  onDuplicate: (id: string) => Promise<void>;
  onEdit?: (tone: ToneProfile) => void;
  onRename?: (id: string, newName: string) => Promise<void>;
}

const ToneCard: React.FC<ToneCardProps> = ({ 
  tone, 
  onDelete, 
  onCopyPrompt, 
  onDuplicate,
  onEdit,
  onRename
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(tone.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(tone.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setShowMenu(false);
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

  const startRename = () => {
    setNewName(tone.name);
    setIsRenaming(true);
    setShowMenu(false);
  };

  const handleRename = async () => {
    if (onRename && newName.trim() && newName !== tone.name) {
      try {
        await onRename(tone.id, newName.trim());
      } finally {
        setIsRenaming(false);
      }
    } else {
      setIsRenaming(false);
      setNewName(tone.name);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(tone.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      cancelRename();
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
        <div className="flex-1 min-w-0 mr-4">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 text-lg font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename();
                  }}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors z-10"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelRename();
                  }}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors z-10"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{tone.name}</h3>
              <span className="text-xs text-gray-500">{formatDate(tone.created_at)}</span>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            ref={menuButtonRef}
            onClick={() => !isRenaming && setShowMenu(!showMenu)}
            className={`p-2 text-gray-500 hover:text-blue-600 rounded-full transition-colors ${
              isRenaming ? 'opacity-0 pointer-events-none' : ''
            }`}
            disabled={isRenaming}
          >
            <MoreVertical size={16} />
          </button>
          
          <AnimatePresence>
            {showMenu && !isRenaming && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
              >
                <button
                  onClick={startRename}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 size={14} />
                  Rename
                </button>
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit Tone
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
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
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
            <div className="relative bg-gray-50 p-4 rounded-md mt-2">
              <div className="text-sm text-gray-700 pr-8">
                {tone.prompt}
              </div>
              <button
                onClick={() => onCopyPrompt(tone.prompt)}
                className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                title="Copy prompt"
              >
                <Copy size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        itemName={tone.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ToneCard;