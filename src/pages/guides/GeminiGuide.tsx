import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, MessageSquare, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GeminiGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
              <Cpu size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gemini Integration Guide</h1>
              <p className="text-gray-600">Seamlessly use your tone with Google's Gemini</p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" />
                Method 1: Conversation Setup
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Start your Gemini conversations with the right tone:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Open Gemini</li>
                  <li>Start a new chat</li>
                  <li>Begin with your tone prompt</li>
                  <li>Ask Gemini to confirm understanding</li>
                  <li>Proceed with your conversation</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Example Setup:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    "I want you to communicate using this specific tone:<br />
                    [Your tone prompt]<br />
                    Please confirm you understand and will maintain this tone."
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                Method 2: Advanced Configuration
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Use Gemini's advanced features for better tone control:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Create a structured prompt template</li>
                  <li>Include your tone specifications</li>
                  <li>Add task-specific requirements</li>
                  <li>Use examples for clarity</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Template Structure:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    Role: Assistant<br />
                    Tone: [Your tone prompt]<br />
                    Task: [Specific task]<br />
                    Format: [Output format]<br />
                    Example: [Sample output]
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Cpu size={24} className="text-blue-600" />
                Method 3: Multi-Modal Integration
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Combine your tone with Gemini's multi-modal capabilities:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Upload or reference visual content</li>
                  <li>Provide your tone prompt</li>
                  <li>Specify how to analyze or describe the content</li>
                  <li>Request responses in your tone</li>
                </ol>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-blue-800">
                    💡 Pro Tip: Gemini excels at understanding context from multiple sources. Combine your tone prompt with visual elements for richer, more contextual responses.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Gemini-Specific Features</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Utilize Gemini's multi-modal understanding</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Leverage structured prompts for consistency</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use examples to reinforce tone preferences</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Combine with Gemini's code understanding features</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeminiGuide;