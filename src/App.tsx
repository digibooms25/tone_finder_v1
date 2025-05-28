import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Header from './components/Header';
import Landing from './pages/Landing';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import TextTone from './pages/TextTone';
import ChatGPTGuide from './pages/guides/ChatGPTGuide';
import ClaudeGuide from './pages/guides/ClaudeGuide';
import GeminiGuide from './pages/guides/GeminiGuide';

function App() {
  const { checkSession, loading } = useAuthStore();
  
  useEffect(() => {
    checkSession();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/text" element={<TextTone />} />
            <Route path="/results" element={<Results />} />
            <Route path="/edit/:toneId" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guides/chatgpt" element={<ChatGPTGuide />} />
            <Route path="/guides/claude" element={<ClaudeGuide />} />
            <Route path="/guides/gemini" element={<GeminiGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App