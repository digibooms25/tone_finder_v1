import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Youtube, AlertCircle, Link as LinkIcon } from 'lucide-react';
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
  const [details, setDetails] = useState<string | null>(null);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      throw new Error('Please enter a YouTube URL');
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    return videoId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDetails(null);
    
    let videoId;
    try {
      videoId = validateUrl(url);
    } catch (error: any) {
      setError(error.message);
      setDetails('Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-transcript`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch transcript', { 
          cause: data.details || 'An unexpected error occurred' 
        });
      }

      const data = await response.json();

      if (!data.transcript) {
        throw new Error('No transcript available', {
          cause: 'The video transcript could not be retrieved. Please ensure the video has captions enabled.'
        });
      }

      // Score the transcript
      const traits = await scoreFreeTextResponse(data.transcript);
      updateTraits(traits);
      
      // Navigate to results
      navigate('/results', { state: { fromQuiz: true } });
    } catch (error: any) {
      setError(error.message);
      setDetails(error.cause || 'Please try again or use a different video');
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
              className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100"
            >
              <div className="flex items-center gap-2 text-red-700 font-medium">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
              {details && (
                <p className="mt-2 text-red-600 text-sm">{details}</p>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-gray-400" />
                </div>
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
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
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
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