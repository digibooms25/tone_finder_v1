import React, { useState } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

interface CopyPromptButtonProps {
  prompt: string;
}

const CopyPromptButton: React.FC<CopyPromptButtonProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Tone Prompt</h3>
      <p className="text-gray-600 mb-4">
        Copy this prompt to use with any AI assistant to write in your personal tone.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-32 overflow-y-auto text-sm text-gray-700">
        {prompt || 'Your tone prompt will appear here after generating results.'}
      </div>
      
      <Button
        onClick={handleCopy}
        disabled={!prompt}
        className="w-full"
        variant={copied ? 'secondary' : 'primary'}
      >
        {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
      </Button>
      
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-center text-sm text-green-600"
        >
          ✓ Prompt copied to clipboard
        </motion.div>
      )}
    </div>
  );
};

export default CopyPromptButton;