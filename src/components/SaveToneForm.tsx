import React, { useState } from 'react';
import Button from './Button';

interface SaveToneFormProps {
  onSave: (name: string) => Promise<void>;
  isLoading: boolean;
  defaultName?: string;
}

const SaveToneForm: React.FC<SaveToneFormProps> = ({ onSave, isLoading, defaultName }) => {
  const [toneName, setToneName] = useState(defaultName || 'The Balanced Communicator');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(toneName);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Save Your Tone</h3>
      
      <div className="mb-4">
        <label htmlFor="tone-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="tone-name"
          type="text"
          value={toneName}
          onChange={(e) => setToneName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Save Tone
      </Button>
    </form>
  );
};

export default SaveToneForm;