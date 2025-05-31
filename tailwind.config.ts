import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'favre-primary': '#E3000F',
        'favre-accent': '#0050B3',
        'favre-text-primary': '#1A1A1A',
        'favre-bg-primary': '#FFFFFF',
        'favre-neutral-dark': '#111111',
        'favre-neutral-light': '#F5F5F5',
        'favre-neutral-medium': '#E0E0E0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
