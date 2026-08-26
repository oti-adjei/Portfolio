import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

/**
 * Remixicon's stylesheet lists five font formats (eot, woff2, woff, ttf, svg). Vite emits
 * every one it sees referenced, which put 4.5MB of legacy formats into dist for the sake of
 * a 185KB woff2 — the only format any browser we support needs. This rewrites the @font-face
 * src list before Vite scans it, so the legacy files are never emitted.
 */
function remixiconWoff2Only(): Plugin {
  return {
    name: 'remixicon-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('remixicon/fonts/remixicon.css')) return null

      const patched = code.replace(/@font-face\s*\{[\s\S]*?\}/, (block) =>
        block
          .replace(/\s*src:[\s\S]*?;/g, '')
          .replace('{', '{\n  src: url("remixicon.woff2") format("woff2");')
      )

      if (patched.includes('remixicon.eot')) {
        throw new Error('remixicon @font-face rewrite failed — upstream CSS shape changed')
      }

      return patched
    },
  }
}

export default defineConfig({
  plugins: [react(), remixiconWoff2Only()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
