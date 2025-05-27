import React from 'react';
import { motion } from 'framer-motion';

interface ToneSummaryProps {
  title: string;
  summary: string;
}

const ToneSummary: React.FC<ToneSummaryProps> = ({ title, summary }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {title || 'The Balanced Communicator'}
      </h2>
      
      <p className="text-gray-600 text-sm mb-4">
        A detailed breakdown of your unique tone and communication patterns.
      </p>
      
      {summary ? (
        <p className="text-gray-700 leading-relaxed">{summary}</p>
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