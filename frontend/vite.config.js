import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   theme: {
    extend: {
      colors: {
        "black-primary": "#1a1a1a",
        "orange-primary": "#f97316",
        "orange-secondary": "#fb923c",
        "gray-dark": "#2d2d2d",
        "gray-light": "#4b4b4b",
        "gradient-dark": "#141414",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #1a1a1a 0%, #141414 100%)",
      },
      boxShadow: {
        "orange-glow": "0 0 10px rgba(249, 115, 22, 0.5)",
      },
      transitionProperty: {
        "transform-shadow": "transform, box-shadow",
      },
    },
  },
  plugins: [react(),  tailwindcss(),],
})
