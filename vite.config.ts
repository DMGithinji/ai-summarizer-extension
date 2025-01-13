import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

function copyManifest(): Plugin {
  return {
    name: "copy-manifest",
    buildEnd() {
      const manifest = JSON.parse(fs.readFileSync("./manifest.json", "utf-8"));

      manifest.content_scripts[0].js = ["webSummarizer.js"];
      manifest.content_scripts[1].js = ["aiPasteHandler.js"];
      manifest.content_scripts[2].js = ["youtubeSummarizer.js"];
      manifest.options_page = "src/entries/options/index.html";
      manifest.action.default_icon[48] = "assets/icons/icon48.png";

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

function copyIcons(): Plugin {
  return {
    name: "copy-icons",
    buildEnd() {
      const iconsDir = "./src/assets/icons";
      const iconFiles = fs.readdirSync(iconsDir);

      iconFiles.forEach((iconFile) => {
        const iconPath = `${iconsDir}/${iconFile}`;
        if (fs.statSync(iconPath).isFile()) {
          this.emitFile({
            type: "asset",
            fileName: `assets/icons/${iconFile}`,
            source: fs.readFileSync(iconPath),
          });
        }
      });
    },
  };
}

// Plugin to copy content scripts from temporary directory
function copyContentScripts(): Plugin {
  return {
    name: "copy-content-scripts",
    closeBundle() {
      // Helper function to safely copy file if it exists
      const safeCopyFile = (src: string, dest: string) => {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      };

      const copyFilesForEntry = (dir: string, name: string) => {
        if (fs.existsSync(dir)) {
          // Copy JS file
          safeCopyFile(
            resolve(dir, `${name}.js`),
            resolve('dist', `${name}.js`)
          );
          // Copy CSS file - look for both potential CSS file names
          safeCopyFile(
            resolve(dir, `${name}.css`),
            resolve('dist', `${name}.css`)
          );
          // Clean up temporary directory
          fs.rmSync(dir, { recursive: true });
        }
      };

      copyFilesForEntry('./dist_webSummarizer', 'webSummarizer');
      copyFilesForEntry('./dist_aiPasteHandler', 'aiPasteHandler');
      copyFilesForEntry('./dist_youtubeSummarizer', 'youtubeSummarizer');
    }
  };
}

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'src/entries/options/index.html'),
        background: resolve(__dirname, 'src/background/main.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (info) => {
          const fileName = info.name;
          if (!fileName) return 'assets/[name].[hash][extname]';

          if (fileName === 'manifest.json') return 'manifest.json';

          if (fileName.includes('icon')) {
            if (fileName.startsWith('src/assets/icons/')) {
              return fileName.replace('src/assets/icons/', 'assets/icons/');
            }
            return `assets/icons/${fileName}`;
          }

          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  plugins: [react(), copyManifest(), copyIcons(), copyContentScripts()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  }
});