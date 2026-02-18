import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 20s ease-in-out infinite',
        'float-medium': 'float 15s ease-in-out infinite',
        'float-fast': 'float 10s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(2deg)' },
          '66%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.02)' },
          '50%': { boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
