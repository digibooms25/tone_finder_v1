import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Sparkles, Brain, FileText, Youtube, Sliders, MessageSquare, Save, Share2 } from 'lucide-react';

const UserGuide: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Brain size={24} />,
      content: [
        {
          subtitle: 'Creating Your First Tone',
          steps: [
            'Take the tone test (5 minutes)',
            'Answer questions about your communication style',
            'Get instant analysis of your writing voice',
            'Fine-tune and save your tone profile'
          ]
        },
        {
          subtitle: 'Alternative Methods',
          steps: [
            'Text Analysis: Paste any writing sample',
            'YouTube Analysis: Extract tone from video (coming soon)',
            'Blog Post Analysis: Convert existing content (coming soon)'
          ]
        }
      ]
    },
    {
      id: 'using-tone',
      title: 'Using Your Tone',
      icon: <MessageSquare size={24} />,
      content: [
        {
          subtitle: 'With AI Assistants',
          steps: [
            'Copy your tone prompt',
            'Paste at the start of your AI conversation',
            'Add your specific request',
            'Get responses in your unique voice'
          ]
        },
        {
          subtitle: 'Best Practices',
          steps: [
            'Test with short samples first',
            'Adjust tone settings if needed',
            'Save different versions for different contexts',
            'Use the preview examples as reference'
          ]
        }
      ]
    },
    {
      id: 'customization',
      title: 'Customizing Your Tone',
      icon: <Sliders size={24} />,
      content: [
        {
          subtitle: 'Tone Controls',
          steps: [
            'Adjust formality level',
            'Fine-tune brevity and directness',
            'Balance humor and warmth',
            'Control expressiveness'
          ]
        },
        {
          subtitle: 'Testing Changes',
          steps: [
            'Use the regenerate button to update examples',
            'Review tone summary for accuracy',
            'Check different writing scenarios',
            'Save when satisfied'
          ]
        }
      ]
    },
    {
      id: 'managing-tones',
      title: 'Managing Your Tones',
      icon: <Save size={24} />,
      content: [
        {
          subtitle: 'Organization',
          steps: [
            'Create multiple tone profiles',
            'Name tones descriptively',
            'Duplicate and modify existing tones',
            'Delete unused profiles'
          ]
        },
        {
          subtitle: 'Usage Tips',
          steps: [
            'Create different tones for different contexts',
            'Keep professional and casual tones separate',
            'Update tones as your style evolves',
            'Share prompts with your team'
          ]
        }
      ]
    }
  ];

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

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-4"
          >
            <Book className="text-blue-600 mr-2" size={18} />
            <span className="text-gray-600">Complete User Guide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Master Your Writing Voice
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Learn how to create, customize, and use your unique tone profiles effectively.
          </motion.p>
        </div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-8">
                {section.content.map((block, blockIndex) => (
                  <div key={blockIndex}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{block.subtitle}</h3>
                    <ul className="space-y-3">
                      {block.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Pro Tips</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Create separate tones for different platforms and audiences</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Regularly update your tone as your communication style evolves</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Test your tone with various AI assistants to find the best fit</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Use the preview examples as a quick reference for tone consistency</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default UserGuide;