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
    proxy: {
      // ISTO É O MAIS IMPORTANTE
      // Redireciona qualquer chamada /api para o nosso serviço de backend
      '/api': {
        target: 'http://api-node:5200', // Aponta para o NOME DO SERVIÇO Docker
        changeOrigin: true,
        // Remove o /api do início, pois o nosso backend não o espera
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
})
