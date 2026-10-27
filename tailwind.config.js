/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#2A2A2E',
        signal: '#A1A1AA',
        beige: '#E8D8B7',
        offwhite: '#F4F4F5',
        ink: '#09090B',
        canvas: '#0F0F11',
        surface: '#18181B',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        drama: ['"DM Serif Display"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
