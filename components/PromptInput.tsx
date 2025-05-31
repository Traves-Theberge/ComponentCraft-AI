// Component for user to input their design prompt
'use client';

import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the UI you want to generate... e.g., 'a sleek login form with a dark theme'"
        className="flex-grow p-4 bg-favre-bg-primary text-favre-text-primary border-2 border-favre-neutral-medium rounded-lg placeholder-favre-neutral-dark focus:border-favre-accent focus:ring-1 focus:ring-favre-accent outline-none transition-colors duration-150 ease-in-out shadow-sm"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-8 py-4 bg-favre-primary text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-favre-primary focus:ring-opacity-50 disabled:bg-favre-neutral-medium disabled:text-favre-neutral-dark motion-safe:transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg disabled:shadow-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate'
        )}
      </button>
    </form>
  );
};

export default PromptInput;
