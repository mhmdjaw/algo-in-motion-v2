import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        // baseUrl: 'https://mhmdjaw.github.io/algo-in-motion'
      })
    },
    remix({
      ssr: false,
      // basename: '/algo-in-motion',
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ]
})
