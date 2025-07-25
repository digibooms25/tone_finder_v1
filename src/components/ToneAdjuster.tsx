import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from './Slider';
import Button from './Button';
import { RefreshCw } from 'lucide-react';

interface ToneAdjusterProps {
  traits: {
    formality: number;
    brevity: number;
    humor: number;
    warmth: number;
    directness: number;
    expressiveness: number;
  };
  onTraitsChange: (traits: typeof traits) => void;
  onRegenerate: () => Promise<void>;
  isLoading: boolean;
}

const ToneAdjuster: React.FC<ToneAdjusterProps> = ({
  traits,
  onTraitsChange,
  onRegenerate,
  isLoading,
}) => {
  const [localTraits, setLocalTraits] = useState(traits);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  useEffect(() => {
    setLocalTraits(traits);
  }, [traits]);
  
  const handleTraitChange = (trait: keyof typeof traits, value: number) => {
    const updatedTraits = {
      ...localTraits,
      [trait]: value,
    };
    
    setLocalTraits(updatedTraits);
    onTraitsChange(updatedTraits);
  };
  
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };
  
  const sliderConfig = [
    { trait: 'formality', label: 'Formality', displayLabels: ['Casual', 'Formal'] as [string, string] },
    { trait: 'brevity', label: 'Brevity', displayLabels: ['Detailed', 'Concise'] as [string, string] },
    { trait: 'humor', label: 'Humor', displayLabels: ['Serious', 'Playful'] as [string, string] },
    { trait: 'warmth', label: 'Warmth', displayLabels: ['Reserved', 'Warm'] as [string, string] },
    { trait: 'directness', label: 'Directness', displayLabels: ['Indirect', 'Direct'] as [string, string] },
    { trait: 'expressiveness', label: 'Expressiveness', displayLabels: ['Restrained', 'Expressive'] as [string, string] },
  ];
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Adjust Your Tone</h3>
        <Button
          onClick={handleRegenerate}
          isLoading={isLoading || isRegenerating}
          variant="text"
          size="sm"
          icon={<RefreshCw size={16} />}
        >
          Regenerate
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">Fine-tune your writing style by adjusting these sliders.</p>
      
      <div className="space-y-4">
        {sliderConfig.map(({ trait, label, displayLabels }) => (
          <Slider
            key={trait}
            label={label}
            value={localTraits[trait as keyof typeof traits]}
            onChange={(value) => handleTraitChange(trait as keyof typeof traits, value)}
            displayLabels={displayLabels}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ToneAdjuster;