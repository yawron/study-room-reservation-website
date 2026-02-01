import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#000000',
        input: '#000000',
        ring: '#000000',
        background: '#FFFDF5',
        foreground: '#0E101A',
        primary: {
          DEFAULT: '#00CC66',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#A8E6CF',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#FFD93D',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#FF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#E0E0E0',
          foreground: '#666666',
        },
        brand: {
          dark: '#000000',
          green: '#00CC66',
          accent: '#FFD93D',
          cream: '#F0FDF4',
          gold: '#FF9F1C',
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
