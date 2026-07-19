/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1A6B3A',
        secondary: '#00796B',
        accent: '#F9A825',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'text-muted': '#9CA3AF',
        'text-inverse': '#FFFFFF',
        danger: '#DC2626',
        warning: '#F59E0B',
        success: '#16A34A',
      },
    },
  },
  plugins: [],
};
