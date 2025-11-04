#!/usr/bin/env node

/**
 * Build script for Netlify deployment
 * Ensures all packages are built before building the app
 */

const { execSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

console.log("Building packages...");
execSync("yarn build:packages", { cwd: rootDir, stdio: "inherit" });

console.log("Building app...");
execSync("yarn build:app", { cwd: path.join(rootDir, "excalidraw-app"), stdio: "inherit" });

console.log("Building version...");
execSync("yarn build:version", { cwd: path.join(rootDir, "excalidraw-app"), stdio: "inherit" });

console.log("Build complete!");
