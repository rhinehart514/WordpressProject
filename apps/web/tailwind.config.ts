import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // OpenAI-inspired dark theme colors
        'ai-dark': {
          50: '#f6f6f7',
          100: '#e3e3e6',
          200: '#c5c5cb',
          300: '#a0a0a8',
          400: '#6e6e80',
          500: '#565869',
          600: '#40414f', // Main background
          700: '#343541', // Darker background
          800: '#202123', // Darkest background
          900: '#0d0d0f',
        },
        'ai-accent': {
          50: '#e6f9f4',
          100: '#b3ede0',
          200: '#80e0cc',
          300: '#4dd4b8',
          400: '#1ac7a4',
          500: '#10a37f', // OpenAI green
          600: '#0e8c6f',
          700: '#0c755f',
          800: '#0a5e4f',
          900: '#08473f',
        },
        'ai-border': '#565869',
        'ai-input': '#40414f',
        'ai-hover': '#2a2b32',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.4s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      typography: (theme: any) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.ai-dark.100'),
            '--tw-prose-headings': theme('colors.ai-dark.50'),
            '--tw-prose-links': theme('colors.ai-accent.500'),
            '--tw-prose-code': theme('colors.ai-dark.100'),
            '--tw-prose-pre-bg': theme('colors.ai-dark.800'),
          },
        },
      }),
    },
  },
  plugins: [],
};

export default config;
