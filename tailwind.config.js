/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}'
  ],
  theme: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

