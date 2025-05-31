// Component for editing the generated JSX code (optional)
'use client';

import React, { useState } from 'react';

// Consider using @monaco-editor/react or @codesandbox/sandpack-react
// For now, a simple textarea placeholder

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, readOnly }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleCopy = async () => {
    if (!code || copyButtonText !== 'Copy') return;
    try {
      await navigator.clipboard.writeText(code);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000); // Revert after 2 seconds
    } catch (err) {
      console.error('Failed to copy code: ', err);
      setCopyButtonText('Failed!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    }
  };

  return (
    <div className="bg-favre-neutral-light border-2 border-favre-neutral-medium rounded-lg shadow-lg h-full flex flex-col overflow-hidden motion-safe:transition-shadow duration-150 ease-in-out hover:shadow-xl">
      <div className="bg-favre-neutral-light p-2 flex justify-end items-center border-b border-favre-neutral-medium">
        <button
          onClick={handleCopy}
          disabled={!code || copyButtonText !== 'Copy'}
          className="flex items-center px-3 py-1.5 text-xs font-medium bg-favre-bg-primary text-favre-accent border border-favre-accent rounded-md hover:bg-favre-accent hover:text-favre-bg-primary focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-favre-neutral-light focus:ring-favre-accent motion-safe:transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          title="Copy code to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
            <path fillRule="evenodd" d="M11.402 2.613a3.03 3.03 0 00-1.04-.786A3.03 3.03 0 008.598 2c-.402 0-.79.078-1.15.227a3.03 3.03 0 00-1.04.786A3.03 3.03 0 006 4.75v.552c0 .35.05.69.15.998a3.03 3.03 0 002.45 2.2h.8a3.03 3.03 0 002.45-2.2c.1-.308.15-.647.15-.998V4.75a3.03 3.03 0 00-.398-1.351.303.303 0 00-.107-.173.303.303 0 00-.173-.107A3.03 3.03 0 0011.402 2.613zM6.5 4.75c0-.202.02-.398.059-.586a2.25 2.25 0 014.382 0c.04.188.06.384.06.586v.552a2.25 2.25 0 01-1.008 1.93L10 7.5H9a2.25 2.25 0 01-1.008-1.93L7.94 5.302A2.25 2.25 0 016.5 4.75z" clipRule="evenodd" />
            <path d="M6 9.5A1.5 1.5 0 017.5 8h5A1.5 1.5 0 0114 9.5v5A1.5 1.5 0 0112.5 16h-5A1.5 1.5 0 016 14.5v-5zM7.5 9a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-5z" />
          </svg>
          {copyButtonText}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        readOnly={readOnly} // Added readOnly prop
        className="w-full flex-grow p-4 font-mono text-sm bg-favre-bg-primary text-favre-text-primary focus:ring-2 focus:ring-favre-accent focus:outline-none resize-none rounded-b-md"
        spellCheck="false"
        placeholder="// Generated JSX will appear here"
      />
      {/* Consider adding download buttons here later */}
    </div>
  );
};

export default CodeEditor;
