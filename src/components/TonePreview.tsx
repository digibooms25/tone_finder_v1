import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TonePreviewProps {
  examples: string[];
}

const TonePreview: React.FC<TonePreviewProps> = ({ examples = [] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const previewTypes = [
    'Professional Email',
    'Social Media Post',
    'Customer Service',
    'Creative Writing'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Tone in Action</h3>
      
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left flex items-center justify-between"
        >
          <span className="font-medium text-gray-700">{previewTypes[activeTab]}</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-10"
          >
            {previewTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                  activeTab === index ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        {examples && examples.length > activeTab ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-gray-700 whitespace-pre-line"
          >
            {examples[activeTab]}
          </motion.div>
        ) : (
          <div className="text-gray-500 italic">
            Example not available. Please regenerate your tone.
          </div>
        )}
      </div>
    </div>
  );
};

export default TonePreview;