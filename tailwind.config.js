/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
          bg: '#EFF6FF',
          'bg-light': '#DBEAFE',
        },
        surface: '#FFFFFF',
        'surface-hover': '#F8FAFC',
        border: '#E2E8F0',
        'text-heading': '#1E293B',
        'text-body': '#4B5563',
        'text-muted': '#6B7280',
        'text-dark': '#0F172A',
        bg: '#F1F5FB',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'marquee-left': 'marquee-left 22s linear infinite',
        'spin-slow': 'spin-slow 0.8s linear infinite',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'btn-primary': '0 2px 8px rgba(37, 99, 235, 0.25)',
        'btn-primary-hover': '0 4px 16px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
}
