import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 text-sm">
            Vibe-coded by Digib 2025 ©
          </div>
          <div className="flex gap-6">
            <Link to="/blog" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
              Blog
            </Link>
            <Link to="/guide" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
              User Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;