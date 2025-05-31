// Component to display prompt history (optional)
'use client';

import React from 'react';

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (prompt: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return null; // Or a placeholder message
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Prompt History</h3>
      <ul className="space-y-1">
        {history.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => onSelect(item.prompt)} 
              className="text-blue-500 hover:underline text-sm"
            >
              {item.prompt.length > 50 ? `${item.prompt.substring(0, 50)}...` : item.prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;
