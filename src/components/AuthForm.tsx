import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Button from './Button';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  setShowAuthModal?: (show: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, setShowAuthModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      if (setShowAuthModal) {
        setShowAuthModal(false);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            minLength={6}
          />
        </div>
        
        <Button
          type="submit"
          isLoading={loading}
          className="w-full mt-6"
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;