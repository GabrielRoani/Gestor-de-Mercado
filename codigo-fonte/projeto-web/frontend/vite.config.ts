import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Mantém a porta do seu frontend
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()], // Removemos o plugin do express daqui
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      // O alias @shared pode ser removido se você deletou a pasta
    },
  },
}));