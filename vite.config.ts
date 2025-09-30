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
                cpSync(resolve("src/icons"), resolve("dist/icons"), { recursive: true})
            },
        },
        
    ],
})