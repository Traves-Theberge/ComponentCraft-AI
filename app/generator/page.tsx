'use client';

import React, { useState, useEffect } from 'react';
import { useCompletion } from 'ai/react';
import { mountFiles, startDevServer, WebContainerFile } from '@/lib/utils/webcontainer';
import PromptInput from '@/components/PromptInput';
import LivePreview from '@/components/LivePreview';
import CodeEditor from '@/components/CodeEditor';
import GeometricPulseLoader from '@/components/GeometricPulseLoader';
import { convertHtmlToJsxString } from '@/lib/utils/jsxConverter';
import { formatCode } from '@/lib/utils/formatter';
// import HistoryPanel from '@/components/HistoryPanel'; // Optional

export default function GeneratorPage() {
  const [editableCode, setEditableCode] = useState<string>('// Generated HTML will appear here');
  const [generatedJsx, setGeneratedJsx] = useState<string>('// Generated JSX will appear here');
  const [currentView, setCurrentView] = useState<'html' | 'jsx'>('html');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [overallIsLoading, setOverallIsLoading] = useState<boolean>(false);
  // const [history, setHistory] = useState<any[]>([]); // Optional

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit, // Keep for potential direct form usage if needed elsewhere
    complete, // Add complete function
    isLoading: isCompletionLoading,
    error: aiError,
  } = useCompletion({
    api: '/api/agent',
    async onFinish(prompt, finalCompletionText) {
      if (!finalCompletionText || !finalCompletionText.trim()) {
        console.error('AI generated empty code.');
        const emptyJsx = await formatCode(convertHtmlToJsxString('', 'EmptyComponent'), 'babel');
        setEditableCode('// Error: AI generated empty HTML code.');
        setGeneratedJsx(emptyJsx);
        setOverallIsLoading(false);
        return;
      }

      // Format the AI-generated HTML
      const formattedHtml = await formatCode(finalCompletionText, 'html');
      // `editableCode` will be updated by the useEffect watching `completion` if we set `completion` to formattedHtml.
      // However, `completion` is raw from AI. So, we'll set `editableCode` directly here after formatting.
      setEditableCode(formattedHtml); 

      // Convert formatted HTML to JSX String
      const rawJsxString = convertHtmlToJsxString(formattedHtml); // Pass formatted HTML
      const formattedJsxString = await formatCode(rawJsxString, 'babel');
      setGeneratedJsx(formattedJsxString);

      // Now proceed with WebContainer logic
      try {
        console.log('Mounting files in WebContainer with final AI code...');
        await mountFiles([{ name: 'index.html', contents: formattedHtml }]); // Use formattedHtml for mounting
        console.log('Files mounted in WebContainer.');
        const url = await startDevServer();
        setIframeUrl(url);
        console.log('WebContainer dev server started. Live preview URL:', url);
      } catch (webContainerError: any) {
        console.error('WebContainer Error:', webContainerError.message);
        setEditableCode(prev => prev + `\n\n// WebContainer Error: ${webContainerError.message}`);
        setIframeUrl(null);
      } finally {
        setOverallIsLoading(false);
        console.log('onFinish processing complete.');
      }
    },
    async onError(err: Error) { // ENSURE THIS IS ASYNC
      console.error('AI Completion Error:', err.message);
      // Error will be reflected in editableCode via useEffect on aiError
      // Also update placeholder JSX on error
      const errorJsx = await formatCode(convertHtmlToJsxString(`<!-- AI Error: ${err.message} -->`, 'ErrorComponent'), 'babel');
      setGeneratedJsx(errorJsx);
      setOverallIsLoading(false);
    }
  });

  useEffect(() => {
    if (isCompletionLoading && completion) { // Show streaming completion
      setEditableCode(completion + '\n// Streaming...');
    } else if (!isCompletionLoading && aiError && !completion) { // Only if no completion was ever set by onFinish
        setEditableCode(`// AI Error: ${aiError.message}`);
    }
    // Final formatted code is set in onFinish
  }, [isCompletionLoading, completion, aiError]);

  const startAiGeneration = async (userPrompt: string) => {
    if (!userPrompt.trim()) {
      setEditableCode('// Please enter a prompt.');
      setGeneratedJsx('// Please enter a prompt to generate JSX.');
      return;
    }
    setOverallIsLoading(true);
    setEditableCode('// Generating HTML code...');
    setGeneratedJsx('// Converting HTML to JSX...');
    setIframeUrl(null);
    // The `input` state from useCompletion is already updated by `handleInputChange`.
    // We call `complete` with the current prompt string.
    await complete(userPrompt);
  };


  return (
    <main className="min-h-screen bg-favre-bg-primary font-sans relative overflow-hidden text-favre-text-primary">
      {/* Subtle Background Geometric Shape */}
      <div
        className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-0"
        aria-hidden="true"
      >
        <div className="w-[1000px] h-[1000px] lg:w-[1500px] lg:h-[1500px] bg-favre-neutral-light opacity-30 rounded-full"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full pt-4 md:pt-8 px-8 md:px-16 pb-24 md:pb-32 gap-12">
        <header className="text-center w-full max-w-3xl py-8 border-b-4 border-favre-primary">
        <h1 className="text-5xl md:text-6xl font-extrabold text-favre-primary leading-tight">
          ComponentCraft AI
        </h1>
        <p className="text-lg md:text-xl text-favre-neutral-dark mt-4">
          Transform your ideas into stunning UI components. Describe your vision, and let AI craft the code.
        </p>
      </header>

      <section className="w-full max-w-2xl">
        <PromptInput onSubmit={startAiGeneration} isLoading={overallIsLoading} />
      </section>

      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-favre-text-primary mb-6">Live Preview</h2>
          {(overallIsLoading || isCompletionLoading) && !iframeUrl ? (
            <div className="aspect-video bg-favre-neutral-light border-2 border-solid border-favre-accent rounded-lg flex items-center justify-center p-4 shadow-lg">
              <GeometricPulseLoader />
            </div>
          ) : iframeUrl ? (
            <div className="aspect-square w-full">
              <LivePreview iframeUrl={iframeUrl} />
            </div>
          ) : (
            <div className="aspect-video bg-favre-neutral-light border-2 border-solid border-favre-accent rounded-lg flex items-center justify-center p-4 shadow-lg motion-safe:transition-shadow duration-150 ease-in-out hover:shadow-xl">
              <p className="text-favre-neutral-dark text-center text-lg">
                Your interactive design will appear here once generated.
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-favre-text-primary">Generated Code</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('html')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentView === 'html' ? 'bg-favre-primary text-white' : 'bg-favre-neutral-light text-favre-text-primary hover:bg-favre-accent hover:text-white'}`}
              >
                HTML
              </button>
              <button
                onClick={() => setCurrentView('jsx')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentView === 'jsx' ? 'bg-favre-primary text-white' : 'bg-favre-neutral-light text-favre-text-primary hover:bg-favre-accent hover:text-white'}`}
              >
                JSX
              </button>
            </div>
          </div>
          <CodeEditor 
            code={currentView === 'html' ? editableCode : generatedJsx} 
            onCodeChange={currentView === 'html' ? setEditableCode : () => {}} // JSX is read-only for now
            readOnly={currentView === 'jsx'} 
          />
        </section>
      </div>

      {/* Optional History Panel */}
      {/* <section className="w-full max-w-3xl mt-8">
        <h2 className="text-3xl md:text-4xl font-bold text-favre-text-primary mb-6">History</h2>
        <HistoryPanel history={history} onSelect={(selectedPrompt) => handlePromptSubmit(selectedPrompt)} />
      </section> */}
      </div>
    </main>
  );
}
