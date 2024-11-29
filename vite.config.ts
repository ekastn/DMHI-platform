/// <reference types="vitest/config" />
import path from "node:path";
import solidPlugin from "vite-plugin-solid";

import { defineConfig } from "vite";

export default defineConfig({
    root: path.join(__dirname, "./assets/"),
    base: "/assets/",
    build: {
        outDir: path.join(__dirname, "./build/"),
        manifest: "manifest.json",
        assetsDir: "bundled",
        rollupOptions: {
            input: ["assets/index.tsx", "assets/styles.css"],
        },
        emptyOutDir: true,
        copyPublicDir: false,
    },
    test: {
        root: "./test",
    },
    plugins: [solidPlugin()],
});
