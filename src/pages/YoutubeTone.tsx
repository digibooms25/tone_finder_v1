import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Youtube, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { scoreFreeTextResponse } from '../lib/openai';
import AnalyzingLoader from '../components/AnalyzingLoader';

const YoutubeTone: React.FC = () => {
  const navigate = useNavigate();
  const { updateTraits } = useQuizStore();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch transcript using the edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-transcript`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const { transcript } = await response.json();
      if (!transcript) {
        throw new Error('No transcript available for this video');
      }

      // Score the transcript
      const traits = await scoreFreeTextResponse(transcript);
      updateTraits(traits);
      
      // Navigate to results
      navigate('/results', { state: { fromQuiz: true } });
    } catch (error) {
      setError((error as Error).message);
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
            <div className="bg-red-100 text-red-600 p-4 rounded-xl">
              <Youtube size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">YouTube Tone Analysis</h1>
              <p className="text-gray-600">Analyze your speaking style from a video</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Requirements:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Video must have closed captions or subtitles</li>
                <li>• Video should be in English</li>
                <li>• Minimum 2 minutes of speaking content</li>
                <li>• Clear, natural speech (not scripted)</li>
              </ul>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              icon={<Youtube size={18} />}
            >
              Analyze Video
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YoutubeTone;