/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#E91E63',
          red: '#E53935',
          dark: '#AD1457',
          light: '#FCE4EC',
        },
        accent: {
          green: '#16A34A',
          orange: '#F59E0B',
          error: '#DC2626',
        },
        surface: {
          white: '#FFFFFF',
          light: '#FFF7F9',
          dark: '#252525',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #E91E63, #E53935)',
        'primary-gradient-hover': 'linear-gradient(135deg, #C2185B, #C62828)',
        'light-gradient': 'linear-gradient(135deg, #FFF7F9, #FCE4EC)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(233, 30, 99, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseGentle: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
};
