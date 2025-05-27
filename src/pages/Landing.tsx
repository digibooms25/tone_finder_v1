import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { MessageSquare, Sliders, CopyCheck } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartTest = () => {
    navigate('/quiz');
  };
  
  const features = [
    {
      title: 'Discover Your Voice',
      description: 'Our 20-question test reveals your authentic writing style in just 5 minutes.',
      icon: <MessageSquare size={24} />,
    },
    {
      title: 'Fine-Tune Your Tone',
      description: 'Adjust sliders to customize your tone and see instant examples of your writing style.',
      icon: <Sliders size={24} />,
    },
    {
      title: 'Use Anywhere',
      description: 'Copy your custom tone prompt to use with any AI writing assistant.',
      icon: <CopyCheck size={24} />,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Find your authentic writing voice.</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover, adjust, and reuse your personal writing tone in minutes.
          </p>
          
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={handleStartTest}
                className="px-10"
              >
                Start Tone Test
              </Button>
            </motion.div>
          </div>
        </motion.header>
        
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Take the Test</h3>
              <p className="text-gray-600 text-center max-w-xs">Answer 20 questions about your communication style.</p>
            </div>
            
            <div className="w-full md:w-auto h-0.5 md:h-0.5 bg-blue-200 mb-8 md:mb-0 md:w-24"></div>
            
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Adjust Your Tone</h3>
              <p className="text-gray-600 text-center max-w-xs">Fine-tune your tone with interactive sliders.</p>
            </div>
            
            <div className="w-full md:w-auto h-0.5 md:h-0.5 bg-blue-200 mb-8 md:mb-0 md:w-24"></div>
            
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Use Anywhere</h3>
              <p className="text-gray-600 text-center max-w-xs">Copy your tone prompt to use with any AI writing tool.</p>
            </div>
          </div>
        </motion.section>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            size="lg"
            onClick={handleStartTest}
            className="px-10"
          >
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;