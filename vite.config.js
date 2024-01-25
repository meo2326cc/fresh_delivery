import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  base:'/fresh_delivery/',
  plugins: [react()],
})
