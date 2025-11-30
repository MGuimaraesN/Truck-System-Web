import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para expor o servidor dentro do Docker
    port: 4200, // A porta que definimos
    watch: {
      usePolling: true // Essencial para o hot-reload funcionar via Docker
    },

    // Bloco HMR adicionado para corrigir o erro de websocket no Docker
    hmr: {
      clientPort: 4200,
    },

    proxy: {
      // Redireciona qualquer chamada /api para o nosso serviço de backend
      '/api': {
        target: 'http://api-node:5200',
        changeOrigin: true,
        // A linha 'rewrite' foi removida para corrigir o erro 404
      },
    },
  },
})
