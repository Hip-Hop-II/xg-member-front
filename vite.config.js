import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { PagesFaceRollupPlugin } from './src/pagesFace/plugin/esm'

export default defineConfig({
  plugins: [
    uni(),
    PagesFaceRollupPlugin(path.resolve(__dirname, './src/pagesFace'))
  ]
})
