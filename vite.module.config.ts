import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Create config based on argument
function createModuleConfig(entryFile: string, name: string) {
  return {
    plugins: [react()],
    build: {
      outDir: `dist_${name}`,
      minify: true,
      lib: {
        entry: resolve(__dirname, entryFile),
        name,
        formats: ['iife'],
        fileName: () => `${name}.js`,
      },
      rollupOptions: {
        output: {
          extend: true,
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          intro: 'const process = { env: { NODE_ENV: "production" } };',
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  } as UserConfig;
}

const configs = {
  webSummarizer: createModuleConfig(
    'src/entries/web-summarizer/main.tsx',
    'webSummarizer'
  ),
  aiPasteHandler: createModuleConfig(
    'src/entries/ai-paste-handler/main.ts',
    'aiPasteHandler'
  ),
  youtubeSummarizer: createModuleConfig(
    'src/entries/youtube-summarizer/main.tsx',
    'youtubeSummarizer'
  )
};

const arg = process.argv.pop()?.slice(2) || 'webSummarizer';
export default defineConfig(configs[arg as keyof typeof configs] || configs.webSummarizer);