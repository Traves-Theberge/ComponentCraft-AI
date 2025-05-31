import { htmlToJsx } from 'html-to-jsx-transform';

/**
 * Converts an HTML string to a formatted JSX string, wrapped in a functional React component.
 * Includes basic error handling for conversion failures.
 *
 * @param htmlString The HTML string to convert.
 * @param componentName The desired name for the generated React component (default: 'GeneratedComponent').
 * @returns A string containing the formatted JSX or an error message if conversion fails.
 */
export function convertHtmlToJsxString(
  htmlString: string,
  componentName: string = 'GeneratedComponent'
): string {
  if (!htmlString || !htmlString.trim()) {
    return `// No HTML input provided.\nconst ${componentName} = () => (<></>);\nexport default ${componentName};`;
  }

  try {
    const jsxOutput = htmlToJsx(htmlString);

    // Wrap in a functional component structure
    const componentString = `
import React from 'react';

// Converted from HTML by Draftform
const ${componentName}: React.FC = () => {
  return (
    <>
      ${jsxOutput.split('\n').map(line => `  ${line}`).join('\n')}
    </>
  );
};

export default ${componentName};
`;
    return componentString;
  } catch (error: any) {
    console.error('Error converting HTML to JSX:', error);
    return `
// Error during HTML to JSX conversion:
// ${error.message || 'Unknown error'}

/*
Original HTML that caused the error:
-------------------------------------
${htmlString}
-------------------------------------
*/

import React from 'react';

const ${componentName} = () => {
  return (
    <div>
      <p style={{color: 'red'}}>Error converting HTML to JSX. See console and comments for details.</p>
      {/* The original HTML is included in the comments above for debugging. */}
    </div>
  );
};

export default ${componentName};
`;
  }
}
