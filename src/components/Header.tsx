import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from './Button';
import { LogIn, LogOut, User, ChevronDown, Home, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setShowMenu(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };
  
  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Find Your Tone
        </Link>
        
        <div className="relative">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={<User size={16} />}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2"
              >
                <span className="max-w-[150px] truncate">{user.email}</span>
                <ChevronDown size={16} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 border border-gray-100"
                  >
                    <button
                      onClick={() => {
                        navigate('/');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Home size={16} />
                      Home
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={16} />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/quiz');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PlusCircle size={16} />
                      New Tone
                    </button>
                    
                    <div className="h-px bg-gray-200 my-1" />
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={<LogIn size={16} />}
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
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
                      Sign Up
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
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;