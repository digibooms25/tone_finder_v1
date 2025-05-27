import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TonePreviewProps {
  examples: string[];
}

const TonePreview: React.FC<TonePreviewProps> = ({ examples = [] }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const previewTypes = [
    'Professional Email',
    'Social Media Post',
    'Customer Service',
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Tone in Action</h3>
      
      <div className="flex border-b mb-4">
        {previewTypes.map((type, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        {examples && examples.length > activeTab ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-gray-700"
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