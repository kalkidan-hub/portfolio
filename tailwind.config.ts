export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        'ambient-glow': {
          '0%, 100%': {
            transform: 'translate3d(-14px, -10px, 0) scale(0.92)',
          },
          '50%': {
            transform: 'translate3d(16px, 12px, 0) scale(1.08)',
          },
        },
        'ambient-glow-reverse': {
          '0%, 100%': {
            transform: 'translate3d(12px, 10px, 0) scale(1.06)',
          },
          '50%': {
            transform: 'translate3d(-18px, -14px, 0) scale(0.94)',
          },
        },
        'ambient-glow-soft': {
          '0%, 100%': {
            transform: 'translate3d(0px, 14px, 0) scale(0.96)',
          },
          '50%': {
            transform: 'translate3d(10px, -8px, 0) scale(1.04)',
          },
        },
      },
      animation: {
        'ambient-glow': 'ambient-glow 26s ease-in-out infinite',
        'ambient-glow-reverse': 'ambient-glow-reverse 30s ease-in-out infinite',
        'ambient-glow-soft': 'ambient-glow-soft 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}