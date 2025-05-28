import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { useToneStore } from '../store/useToneStore';
import { scoreFreeTextResponse } from '../lib/openai';
import AnalyzingLoader from '../components/AnalyzingLoader';

const TextTone: React.FC = () => {
  const navigate = useNavigate();
  const { updateTraits } = useQuizStore();
  const { generateContent, resetCurrentTone } = useToneStore();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(countWords(newText));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (wordCount < 50) {
      setError('Please enter at least 50 words for accurate analysis.');
      return;
    }

    if (wordCount > 1000) {
      setError('Please limit your text to 1000 words.');
      return;
    }

    setIsLoading(true);
    try {
      // Reset any previous tone data
      resetCurrentTone();
      
      // Score the text first
      const traits = await scoreFreeTextResponse(text);
      
      // Update traits in store
      updateTraits(traits);
      
      // Generate content based on traits
      await generateContent();
      
      // Only navigate after content is generated
      navigate('/results');
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'An error occurred during analysis. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AnalyzingLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-xl">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Text Analysis</h1>
              <p className="text-gray-600">Analyze your writing style from any text</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100"
            >
              <div className="flex items-center gap-2 text-red-700 font-medium">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Your Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Paste or write your text here..."
                rows={10}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className={`font-medium ${wordCount > 1000 ? 'text-red-500' : 'text-gray-700'}`}>
                  {wordCount}/1000 words
                </span>
                <span className="text-gray-500">
                  {wordCount < 50 ? '50 words minimum' : wordCount > 1000 ? '1000 words maximum' : ''}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2">Tips for best results:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use your natural writing style</li>
                <li>• Include complete sentences and paragraphs</li>
                <li>• Aim for at least 100-200 words for better accuracy</li>
                <li>• You can use emails, blog posts, or any written content</li>
              </ul>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              icon={<FileText size={18} />}
              disabled={wordCount < 50 || wordCount > 1000}
            >
              Analyze Text
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TextTone;