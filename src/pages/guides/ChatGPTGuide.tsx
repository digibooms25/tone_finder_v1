import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Settings, FileCode, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatGPTGuide: React.FC = () => {
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
              <MessageCircle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ChatGPT Integration Guide</h1>
              <p className="text-gray-600">Three ways to use your tone with ChatGPT</p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle size={24} className="text-blue-600" />
                Method 1: Conversation Prompts
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  The simplest way to use your tone with ChatGPT is to paste your tone prompt at the start of a conversation:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Open ChatGPT and start a new conversation</li>
                  <li>Copy your tone prompt from the dashboard</li>
                  <li>Paste the prompt as your first message</li>
                  <li>Add your specific request or question</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Example:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    [Your tone prompt]<br />
                    Please write an email to schedule a team meeting.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                Method 2: Custom Instructions
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  For a persistent tone across all conversations, add your tone to ChatGPT's custom instructions:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Click your profile picture</li>
                  <li>Select "Customize ChatGPT"</li>
                  <li>Under "What traits should ChatGPT have?", paste your tone prompt</li>
                  <li>Click "Save"</li>
                </ol>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-blue-800">
                    💡 Pro Tip: You can combine your tone with ChatGPT's built-in traits like "Chatty", "Witty", "Straight shooting", "Encouraging", "Gen Z", "Skeptical", "Traditional", "Forward thinking", or "Poetic" for more nuanced responses.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileCode size={24} className="text-blue-600" />
                Method 3: Project Instructions
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  For project-specific tone settings:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Create a new project in ChatGPT</li>
                  <li>Click "Add instructions" in the project sidebar</li>
                  <li>Paste your tone prompt in the instructions field</li>
                  <li>Click "Save" to apply to all conversations in the project</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Alternative Method:</p>
                  <p className="text-gray-700">
                    You can also create a text file named <code>tone.txt</code> with your tone prompt and add it to your project files. This keeps your tone settings with your project and makes them easy to reference.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Best Practices</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Test the tone with short samples first</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Adjust the prompt if needed for better results</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use method 2 for consistent, long-term tone application</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Combine with specific context for best results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTGuide;