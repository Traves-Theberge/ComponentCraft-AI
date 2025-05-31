// Component to display the live preview from WebContainer
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  iframeUrl: string | null;
}

const LivePreview: React.FC<LivePreviewProps> = ({ iframeUrl }) => {
  // The parent component (GeneratorPage) now handles the placeholder when iframeUrl is null,
  // so this component can assume iframeUrl is always provided when it's rendered.
  if (!iframeUrl) {
    // This case should ideally not be reached if GeneratorPage handles null iframeUrl correctly.
    // However, as a fallback, render nothing or a minimal error to avoid breaking.
    return null; 
  }

  return (
    <div className="w-full h-full bg-favre-neutral-light border-2 border-favre-neutral-medium rounded-lg p-1 shadow-lg overflow-hidden motion-safe:transition-shadow duration-150 ease-in-out hover:shadow-xl">
      <iframe
        src={iframeUrl} // iframeUrl is guaranteed to be non-null here by the check above or parent logic
        className="w-full h-full rounded-md bg-white" // bg-white for the iframe's own background before content loads
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      ></iframe>
    </div>
  );
};

export default LivePreview;
