import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useQuizStore } from '../store/useQuizStore';
import Button from './Button';
import { LogIn, LogOut, Menu, X, PlusCircle, LayoutDashboard, FileText, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { resetQuiz } = useQuizStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAuthModal(false);
      }
    };

    if (showAuthModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAuthModal]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setShowMenu(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const handleNavigation = (path: string) => {
    if (path === '/quiz') {
      resetQuiz();
    }
    navigate(path);
    setShowMenu(false);
  };

  const handleProtectedNavigation = (path: string) => {
    if (user) {
      handleNavigation(path);
    } else {
      setAuthMode('signin');
      setShowAuthModal(true);
      setShowMenu(false);
    }
  };
  
  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            toneofvoice.ai
          </Link>
          <span className="text-sm text-gray-500 hidden sm:block">
            Make AI sound like you
          </span>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg py-4"
            >
              <div className="container mx-auto px-4 flex flex-col gap-2">
                {user && (
                  <button
                    onClick={() => handleNavigation('/account')}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 border-b border-gray-100 mb-2 hover:bg-gray-50 w-full"
                  >
                    <span>{user.email}</span>
                    <Settings size={16} />
                  </button>
                )}
                
                <button
                  onClick={() => handleProtectedNavigation('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                
                <button
                  onClick={() => handleNavigation('/quiz')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <PlusCircle size={16} />
                  New Tone Test
                </button>

                <button
                  onClick={() => handleNavigation('/text')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <FileText size={16} />
                  Text-to-Tone
                </button>
                
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setShowAuthModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <LogIn size={16} />
                    Sign In / Create Account
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {authMode === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
                  </h2>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600">
                    {authMode === 'signin' 
                      ? 'Sign in to save your tones and access them from anywhere.'
                      : 'Create an account to save your tones and access them from any device.'}
                  </p>
                </div>
                
                <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
                
                <div className="mt-4 text-center text-sm">
                  {authMode === 'signin' ? (
                    <p>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="text-blue-600 hover:underline"
                      >
                        Create Account
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        onClick={() => setAuthMode('signin')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;