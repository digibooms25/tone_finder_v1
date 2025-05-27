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
              <p className="text-gray-600">Three ways to use your tone with Gemini</p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" />
                Method 1: Direct Chat Prompts
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  The most straightforward way to apply your tone in Gemini:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Open Gemini (at gemini.google.com or via the Gemini app)</li>
                  <li>Start a new chat</li>
                  <li>Copy your tone prompt from the dashboard</li>
                  <li>Paste the prompt as your first message</li>
                  <li>Add your specific request or question</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">Example:</p>
                  <p className="text-gray-700 font-mono text-sm">
                    [Your tone prompt]<br />
                    Please draft an announcement about our new product feature.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                Method 2: Custom Gems
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Create a reusable, persistent tone for specific tasks:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Go to Gemini (gemini.google.com)</li>
                  <li>Click "Gems" in the sidebar (or menu ☰)</li>
                  <li>Click "+ Create new Gem"</li>
                  <li>Name your Gem descriptively</li>
                  <li>Paste your tone prompt in "Instructions"</li>
                  <li>Click "Create" and "Save"</li>
                </ol>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-blue-800">
                    💡 Pro Tip: You can enhance your Gem's instructions with specific roles and output formats alongside your tone prompt for highly tailored responses.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Cpu size={24} className="text-blue-600" />
                Method 3: Project-Specific Gems
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Create dedicated Gems for projects requiring specific tone and context:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>Create a new Gem as in Method 2</li>
                  <li>Name it for your project</li>
                  <li>Add your tone prompt to instructions</li>
                  <li>Upload relevant project files</li>
                  <li>Save and use for project tasks</li>
                </ol>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-700">
                    You can also upload a <code>tone.txt</code> file with your tone prompt to keep all project-related instructions together in your Gem.
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
              <span>Start with clear tone prompts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Test and iterate your prompts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use Gems for consistency</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Provide clear context with your tone</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Be specific in your descriptions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeminiGuide;