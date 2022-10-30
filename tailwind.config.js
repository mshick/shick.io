const { fontFamily } = require('tailwindcss/defaultTheme')
const { typography } = require('@mshick/tufted/tailwind')

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  safelist: ['aspect-video'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      animation: {
        marquee: 'marquee 30s linear infinite',
        marquee2: 'marquee2 30s linear infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '5%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '5%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
      fontFamily: {
        sans: ['Bitstream Vera Sans Mono', ...fontFamily.sans],
        mono: ['Bitstream Vera Sans Mono', ...fontFamily.mono]
      },
      typography
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
