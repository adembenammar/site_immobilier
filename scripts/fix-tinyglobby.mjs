import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "node_modules", "picomatch");
const targetDir = path.join(root, "node_modules", "tinyglobby", "node_modules", "picomatch");

if (!fs.existsSync(sourceDir) || !fs.existsSync(path.join(root, "node_modules", "tinyglobby"))) {
  process.exit(0);
}

const hasTargetFiles = fs.existsSync(path.join(targetDir, "index.js"));

if (!hasTargetFiles) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log("fixed tinyglobby nested picomatch");
}
