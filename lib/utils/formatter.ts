import prettier from 'prettier/standalone';
import parserHtml from 'prettier/plugins/html';
import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree'; // parserBabel depends on this

/**
 * Formats a code string using Prettier.
 *
 * @param code The code string to format.
 * @param parser The Prettier parser to use ('html', 'babel', 'typescript').
 *               'babel' is generally used for JSX.
 * @returns A Promise that resolves to the formatted code string, or the original string if formatting fails.
 */
export async function formatCode(
  code: string,
  parser: 'html' | 'babel' | 'typescript' = 'babel' // Default to babel for JSX
): Promise<string> {
  if (!code || !code.trim()) {
    return code; // Return empty or whitespace-only strings as is
  }
  try {
    const formattedCode = await prettier.format(code, {
      parser: parser,
      plugins: [parserHtml, parserBabel, parserEstree],
      // You can add more Prettier options here if needed, e.g.:
      // semi: true,
      // singleQuote: true,
      // tabWidth: 2,
    });
    return formattedCode;
  } catch (error) {
    console.warn(`Prettier formatting failed for parser '${parser}':`, error);
    // Return the original code if formatting fails, to not break the flow
    return code;
  }
}
