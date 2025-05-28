import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/Button';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100"
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
            <p className="text-gray-600 mb-6">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!showConfirm ? (
              <Button
                onClick={() => setShowConfirm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
            ) : (
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Are you sure you want to delete your account?
                    </h3>
                    <p className="text-red-700">
                      This will permanently delete your account and all your tone profiles. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Yes, Delete My Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;