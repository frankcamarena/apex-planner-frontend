// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // === MODIFICACIÓN CRÍTICA PARA ARREGLAR MÓDULOS CJS ===
  optimizeDeps: {
    // Forzamos a Vite a procesar estos módulos que suelen fallar
    include: [
      '@chakra-ui/react', 
      '@emotion/react', 
      'framer-motion',
      'hoist-non-react-statics', // <-- ¡EL MÓDULO QUE ESTÁ FALLANDO!
      'react-is', // Otra dependencia común de Emotion
    ],
  },
  // =========================================================
})