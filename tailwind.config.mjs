/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        fadeInScale: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        rotateIn: {
          '0%': { opacity: 0, transform: 'rotateY(-90deg)' },
          '100%': { opacity: 1, transform: 'rotateY(0)' }
        },
      },
      animation: {
        'zoom-in': 'zoomIn 0.7s ease-in-out forwards',
        'zoom-out': 'zoomOut 0.7s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in-scale': 'fadeInScale 1s ease-out forwards',
        'rotate-in': 'rotateIn 1s ease-out forwards'
      },
    },
  },
  plugins: [],
};
