// Streamed AI agent handler
import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai'; // Reverted to CoreMessage

// Import your tool definitions
import { generateAdaptiveCardTool } from '@/lib/tools/generateAdaptiveCard';
import { generateCopyTool } from '@/lib/tools/generateCopy';
import { generateImageTool } from '@/lib/tools/generateImage';
import { convertToReactTool } from '@/lib/tools/convertToReact';

// IMPORTANT: Set your OpenAI API key in your environment variables.
// Create an .env.local file in the root of your project with:
// OPENAI_API_KEY=your_openai_api_key

// openaiProvider is no longer needed with direct import

export const maxDuration = 30; // Optional: Set a timeout for Vercel functions

export async function POST(req: NextRequest) {
  try {
    const { prompt }: { prompt: string } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = 'You are a UI code assistant that generates structured Adaptive Cards, copy, images, and then converts them to React component code. First, generate an Adaptive Card layout based on the user prompt. Then, generate appropriate copy (heading and paragraph) for this layout. After that, generate an image URL relevant to the layout and copy. Finally, take the Adaptive Card, the copy, and the image URL to generate a complete React functional component as a JSX string. Ensure the final output is only the React JSX code string.';

        const messages: CoreMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];

    const result = await streamText({
      model: openai('gpt-4.1-mini'),
      messages, // Use CoreMessages directly
      tools: {
        generateAdaptiveCard: generateAdaptiveCardTool,
        generateCopy: generateCopyTool,
        generateImage: generateImageTool,
        convertToReact: convertToReactTool,
      },
      // maxToolRoundtrips: 4, // Default behavior will be used
      // The AI SDK will automatically call the tools and feed their results back into the model.
      // We want the final text stream to be the React code from convertToReact.
    });

    // For ai@4.x.x, textStream is used directly with new Response
    return new Response(result.textStream);

  } catch (error) {
    console.error('Error in AI agent route:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: 'Failed to process AI request', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
