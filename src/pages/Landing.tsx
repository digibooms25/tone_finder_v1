import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useQuizStore } from '../store/useQuizStore';
import { Brain, Sliders, Wand2, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuizStore();
  
  const handleStartTest = () => {
    resetQuiz();
    navigate('/quiz');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn your tone into a<br />
            <span className="text-blue-600">signature style</span>
            <span className="inline-block ml-2">✨</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take a 5-minute test to discover your personal writing voice — and make every word sound like you.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleStartTest}
              className="px-10 py-6 text-lg"
              icon={<ArrowRight className="ml-2" />}
              iconPosition="right"
            >
              Start Tone Test
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl inline-block mb-6">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Unlock Your True Tone</h3>
              <p className="text-gray-600">Answer 20 quick questions to reveal your unique writing personality.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl inline-block mb-6">
                <Sliders size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Dial In Your Voice</h3>
              <p className="text-gray-600">Use intuitive sliders to explore different versions of your tone — live and in real-time.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl inline-block mb-6">
                <Wand2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Your Voice, Your Tools</h3>
              <p className="text-gray-600">Copy your custom prompt and use it across any AI writing app — instantly.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">1</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Take the Quiz</h3>
              <p className="text-gray-600">Answer 20 fun, insightful questions about your communication habits.</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">2</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">See Your Voice in Action</h3>
              <p className="text-gray-600">Watch your writing tone come to life with examples and real-time feedback.</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">3</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Copy & Use Anywhere</h3>
              <p className="text-gray-600">Grab your personalized prompt and plug it into any AI tool you love.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sample Tones */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">See Sample Tones</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">The Warm Mentor</h3>
              <p className="text-gray-600 italic">"Let's take this step-by-step, I'm right here with you."</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">The Edgy Innovator</h3>
              <p className="text-gray-600 italic">"Why settle for ordinary when you can rewrite the rules?"</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">The Zen Storyteller</h3>
              <p className="text-gray-600 italic">"Words drift like leaves—intentional, effortless, calm."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emotional Hook Footer */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Writing isn't just about words — it's about how you make people feel 💡
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your tone shapes trust, personality, and connection.
            </p>
            <p className="text-2xl font-bold text-blue-600 mb-12">
              Start sounding more like <em>you.</em>
            </p>
            <Button
              size="lg"
              onClick={handleStartTest}
              className="px-10 py-6 text-lg"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;