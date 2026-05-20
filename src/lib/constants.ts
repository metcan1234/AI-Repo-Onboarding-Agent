export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "coverage",
  ".cache",
  "__pycache__",
  ".venv",
  "venv",
  ".idea",
  ".vscode",
  "target",
  "vendor",
]);

export const IGNORED_FILES = new Set([
  ".DS_Store",
  "Thumbs.db",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

export const KEY_FILENAMES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "Pipfile",
  "go.mod",
  "Cargo.toml",
  "pom.xml",
  "build.gradle",
  "main.py",
  "app.py",
  "index.ts",
  "index.tsx",
  "main.ts",
  "server.ts",
  "next.config.ts",
  "next.config.js",
  "docker-compose.yml",
  "Dockerfile",
  "README.md",
];

export const MAX_SCAN_DEPTH = 5;
export const MAX_FILES = 250;
export const MAX_PREVIEW_CHARS = 1200;
export const MAX_CONTEXT_JSON_CHARS = 80_000;
