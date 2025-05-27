import React from 'react';
import { ToneProfile } from '../lib/supabase';
import Button from './Button';

interface ToneCardProps {
  tone: ToneProfile;
  onDelete: (id: string) => Promise<void>;
  onCopyPrompt: (prompt: string) => void;
}

const ToneCard: React.FC<ToneCardProps> = ({ tone, onDelete, onCopyPrompt }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${tone.name}"?`)) {
      await onDelete(tone.id);
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
        <h3 className="text-lg font-semibold text-gray-800">{tone.name}</h3>
        <span className="text-xs text-gray-500">{formatDate(tone.created_at)}</span>
      </div>
      
      <div className="mb-6 space-y-2">
        {traitBars.map((trait) => (
          <div key={trait.name} className="flex items-center text-sm">
            <span className="w-32 text-gray-600">{trait.name}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600"
                style={{ 
                  width: `${((trait.value + 1) / 2) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onCopyPrompt(tone.prompt)}
        >
          Copy Prompt
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ToneCard;