/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: [
    // Gradient classes for project cards
    'from-pink-100',
    'via-purple-100',
    'from-blue-50',
    'via-blue-100',
    'to-sky-100',
    'from-purple-100',
    'via-pink-100',
    'to-pink-50',
    'from-accent',
    'via-accent-light',
    'to-secondary-light',
    'from-primary',
    'via-secondary',
    'to-primary-light',
    // Background gradients
    'from-green-100',
    'via-blue-100',
    'to-teal-50',
    'from-blue-500',
    'via-indigo-500',
    'to-purple-600',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E5266',
          light: '#3D6A82',
          dark: '#1F3A47',
        },
        secondary: {
          DEFAULT: '#6E8898',
          light: '#8FA3B0',
          dark: '#5A6F7D',
        },
        accent: {
          DEFAULT: '#5F8575',
          light: '#7A9D8E',
          dark: '#4A6A5D',
        },
        sage: {
          DEFAULT: '#677969',
          light: '#7E9281',
          dark: '#505F52',
        },
        cream: {
          DEFAULT: '#F1F0EA',
          dark: '#E5E3D8',
        },
        earth: {
          DEFAULT: '#4C2719',
          light: '#6B3A27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
