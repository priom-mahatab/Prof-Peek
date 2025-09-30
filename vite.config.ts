import { defineConfig } from "vite";
import { copyFileSync, cpSync } from "fs";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                background: "src/background.ts",
                content: "src/content.ts"
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
        outDir: "dist",
        emptyOutDir: true,
    },
    plugins: [
        {
            name: "copy-assets",
            writeBundle() {
                copyFileSync(resolve("src/manifest.json"), resolve("dist/manifest.json"));
                copyFileSync(resolve("src/popup.html"), resolve("dist/popup.html")); 
                copyFileSync(resolve("src/styles.css"), resolve("dist/styles.css"));   
                cpSync(resolve("src/icons"), resolve("dist/icons"), { recursive: true})
            },
        },
        
    ],
})