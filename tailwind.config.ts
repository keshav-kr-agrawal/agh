import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#8B3A2B',
          dark: '#6E2D21',
          light: '#A64B3C',
        },
        crimson: {
          DEFAULT: '#7A1C1C',
          dark: '#5C1414',
          light: '#982727',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA8C2C',
        },
        amberGold: {
          DEFAULT: '#E5A93C',
          light: '#F4C468',
          dark: '#B88022',
        },
        cream: {
          DEFAULT: '#FFFDF9',
          muted: '#F7F4EF',
          border: '#E8E2D8',
        },
        espresso: {
          DEFAULT: '#221C1B',
          light: '#3D3331',
          muted: '#665A57',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
