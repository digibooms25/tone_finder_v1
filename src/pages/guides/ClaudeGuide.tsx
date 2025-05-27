import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Settings, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClaudeGuide: React.FC = () => {
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
              <Bot size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Claude Integration Guide</h1>
              <p className="text-gray-600">Master Claude's unique features for consistent tone</p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                Method 1: System Prompt
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Use Claude's system prompt feature to set your tone for the entire conversation:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Start a new conversation in Claude</li>
                  <li>Click the "..." menu</li>
                  <li>Select "Create new prompt"</li>
                  <li>Add your tone prompt in the system prompt section</li>
                  <li>Save and start your conversation</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Example System Prompt:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    You are an assistant that communicates using the following style:<br />
                    [Your tone prompt]
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" />
                Method 2: Document Analysis
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  For document analysis and editing, use this specialized approach:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Upload or paste your document</li>
                  <li>Provide your tone prompt as context</li>
                  <li>Specify the type of analysis or editing needed</li>
                  <li>Request the output in your tone</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Example Request:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    Please analyze this document and provide feedback. When writing your analysis, use this tone:<br />
                    [Your tone prompt]
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bot size={24} className="text-blue-600" />
                Method 3: Conversation Memory
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Leverage Claude's conversation memory for consistent tone:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Start with your tone prompt</li>
                  <li>Ask Claude to confirm understanding</li>
                  <li>Proceed with your conversation</li>
                  <li>Reference the tone if needed</li>
                </ol>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-blue-800">
                    💡 Pro Tip: Claude can remember your tone preferences throughout the conversation, but it's good practice to occasionally remind it of specific aspects of your tone.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Claude-Specific Tips</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use Claude's constitution feature to reinforce tone</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Leverage multi-turn conversations for tone refinement</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Combine with Claude's file analysis capabilities</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use system prompts for most consistent results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClaudeGuide;