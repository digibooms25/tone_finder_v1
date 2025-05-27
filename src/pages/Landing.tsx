import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { Brain, Sliders, Wand2, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

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
      <section className="relative pt-32 pb-40 px-4">
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
            Take a 5-minute test to discover your unique voice and make every word authentically yours.
          </p>

          <motion.div
            className="flex justify-center"
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
              Start Your Journey
            </Button>
          </motion.div>
        </motion.div>
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

      {/* Process Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to find your perfect tone</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "01",
                title: "Take the Quiz",
                description: "Answer 20 engaging questions about your communication style."
              },
              {
                number: "02",
                title: "Get Your Analysis",
                description: "Receive a detailed breakdown of your unique writing personality."
              },
              {
                number: "03",
                title: "Start Writing",
                description: "Use your custom prompt with any AI tool for consistent results."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto transform -rotate-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
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
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              onClick={handleStartTest}
              className="px-12 py-6 text-lg shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;