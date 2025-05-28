import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { Brain, Sliders, Wand2, ArrowRight, Sparkles, MessageSquare, Youtube, FileText, PenTool } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuizStore();
  
  const handleStartTest = () => {
    resetQuiz();
    navigate('/quiz');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-8"
          >
            <Sparkles className="text-yellow-500 mr-2" size={18} />
            <span className="text-gray-600">Discover your authentic writing voice</span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Turn your tone into a
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              signature style
            </span>
            <motion.span 
              className="inline-block ml-2"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Take a 5-minute test to discover your unique voice, and get a custom tone prompt you can use anywhere.
          </p>

          <div className="flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={handleStartTest}
                className="px-12 py-6 text-lg shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                icon={<ArrowRight className="ml-2\" size={24} />}
                iconPosition="right"
              >
                Start Tone Test
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* More Ways to Create Tones Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            More Ways to Create Tones
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Youtube size={32} />,
                title: "Extract from YouTube Video",
                description: "Analyze your speaking style from any YouTube video with captions.",
                gradient: "from-red-500 to-red-600"
              },
              {
                icon: <FileText size={32} />,
                title: "Turn Blog Post into Your Tone",
                description: "Convert your existing writing into a reusable tone profile.",
                gradient: "from-emerald-500 to-emerald-600"
              },
              {
                icon: <PenTool size={32} />,
                title: "Write Your Own Text",
                description: "Create a tone profile from your custom writing sample.",
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((method, index) => (
              <div key={index} className="opacity-50 cursor-not-allowed">
                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${method.gradient} shadow-xl`}>
                  <div className="relative text-white">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-block mb-6">
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{method.title}</h3>
                    <p className="leading-relaxed mb-6 opacity-90">{method.description}</p>
                    <div className="flex items-center font-medium">
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={28} />,
                title: "AI-Powered Analysis",
                description: "Our advanced algorithm analyzes your natural writing patterns to create your unique tone profile."
              },
              {
                icon: <Sliders size={28} />,
                title: "Real-time Customization",
                description: "Fine-tune your tone with interactive controls and see instant examples of your style."
              },
              {
                icon: <MessageSquare size={28} />,
                title: "Universal Compatibility",
                description: "Use your custom tone prompt with any AI writing assistant for consistent communication."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                  <div className="relative">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Integration Guides Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Use Your Tone Everywhere</h2>
            <p className="text-xl text-gray-600">Step-by-step guides for your favorite AI assistants</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "https://raw.githubusercontent.com/digibooms25/images/refs/heads/main/openai.png",
                title: "ChatGPT Guide",
                description: "Learn three ways to use your tone with ChatGPT: conversation prompts, system instructions, and project settings.",
                link: "/guides/chatgpt",
                gradient: "from-emerald-400 to-teal-500",
                hoverGradient: "from-emerald-500 to-teal-600"
              },
              {
                icon: "https://raw.githubusercontent.com/digibooms25/images/refs/heads/main/claude.png",
                title: "Claude Guide",
                description: "Master Claude's unique features to maintain your writing style across conversations and documents.",
                link: "/guides/claude",
                gradient: "from-purple-400 to-indigo-500",
                hoverGradient: "from-purple-500 to-indigo-600"
              },
              {
                icon: "https://raw.githubusercontent.com/digibooms25/images/refs/heads/main/gemini.png",
                title: "Gemini Guide",
                description: "Integrate your tone seamlessly with Google's Gemini for consistent communication.",
                link: "/guides/gemini",
                gradient: "from-rose-400 to-pink-500",
                hoverGradient: "from-rose-500 to-pink-600"
              }
            ].map((guide, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(guide.link)}
              >
                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${guide.gradient} group-hover:${guide.hoverGradient} transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-[1.02] shadow-xl`}>
                  <div className="relative text-white">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={guide.icon} 
                        alt={guide.title} 
                        className="w-8 h-8"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{guide.title}</h3>
                    <p className="leading-relaxed mb-6 opacity-90">{guide.description}</p>
                    <div className="flex items-center font-medium">
                      <span>View Guide</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to find your voice? 
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Start your journey today
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of writers who've discovered their authentic tone and transformed their communication.
          </p>
          <div className="flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={handleStartTest}
                className="px-12 py-6 text-lg shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Start Tone Test
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;