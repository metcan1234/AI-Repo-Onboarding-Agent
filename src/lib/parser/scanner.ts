import fs from "fs/promises";
import path from "path";
import {
  IGNORED_DIRS,
  IGNORED_FILES,
  KEY_FILENAMES,
  MAX_FILES,
  MAX_PREVIEW_CHARS,
  MAX_SCAN_DEPTH,
} from "@/lib/constants";
import type { KeyFileSummary, ProjectFileNode } from "@/types";
import {
  detectFromPackageJson,
  detectFromPyProject,
  detectFromRequirements,
  detectLanguagesFromPaths,
  inferEntryPointsFromKeyFiles,
  mergeDetections,
} from "./detector";
import type { ParsedRepository } from "@/types";

interface ScanState {
  fileCount: number;
  truncated: boolean;
  allPaths: string[];
  keyFiles: KeyFileSummary[];
}

async function readPreview(filePath: string): Promise<string | undefined> {
  try {
    const buf = await fs.readFile(filePath, { encoding: "utf8", flag: "r" });
    return buf.slice(0, MAX_PREVIEW_CHARS);
  } catch {
    return undefined;
  }
}

function roleForKeyFile(name: string): string {
  const roles: Record<string, string> = {
    "package.json": "Node bağımlılıkları ve scriptler",
    "requirements.txt": "Python bağımlılıkları",
    "pyproject.toml": "Python proje yapılandırması",
    "main.py": "Python giriş noktası",
    "app.py": "Uygulama giriş noktası",
    "next.config.ts": "Next.js yapılandırması",
    "next.config.js": "Next.js yapılandırması",
    "docker-compose.yml": "Konteyner orkestrasyonu",
    Dockerfile: "Konteyner imajı",
    "README.md": "Proje dokümantasyonu",
  };
  return roles[name] ?? "Yapılandırma / kaynak dosyası";
}

async function scanDirectory(
  dirPath: string,
  relativePath: string,
  depth: number,
  state: ScanState
): Promise<ProjectFileNode[]> {
  if (depth > MAX_SCAN_DEPTH || state.fileCount >= MAX_FILES) {
    state.truncated = true;
    return [];
  }

  let entries: { name: string; isDirectory: () => boolean }[];
  try {
    const raw = await fs.readdir(dirPath, { withFileTypes: true });
    entries = raw
      .filter((e) => !e.name.startsWith(".") || e.name === ".env.example")
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }

  const nodes: ProjectFileNode[] = [];

  for (const entry of entries) {
    if (state.fileCount >= MAX_FILES) {
      state.truncated = true;
      break;
    }

    const name = entry.name;
    if (IGNORED_DIRS.has(name) || IGNORED_FILES.has(name)) continue;

    const fullPath = path.join(dirPath, name);
    const relPath = relativePath ? `${relativePath}/${name}` : name;

    if (entry.isDirectory()) {
      const children = await scanDirectory(
        fullPath,
        relPath,
        depth + 1,
        state
      );
      nodes.push({
        name,
        path: relPath,
        type: "directory",
        children: children.length > 0 ? children : undefined,
      });
      continue;
    }

    state.fileCount += 1;
    state.allPaths.push(relPath);

    let preview: string | undefined;
    if (KEY_FILENAMES.includes(name) || name.endsWith(".env.example")) {
      preview = await readPreview(fullPath);
      state.keyFiles.push({
        path: relPath,
        role: roleForKeyFile(name),
        preview,
      });
    }

    nodes.push({
      name,
      path: relPath,
      type: "file",
      preview: preview ? preview.slice(0, 400) : undefined,
    });
  }

  return nodes;
}

export async function parseRepository(
  rootPath: string
): Promise<ParsedRepository> {
  const state: ScanState = {
    fileCount: 0,
    truncated: false,
    allPaths: [],
    keyFiles: [],
  };

  const structure = await scanDirectory(rootPath, "", 0, state);

  let frameworks: string[] = [];
  let entryPoints: string[] = [];

  for (const kf of state.keyFiles) {
    if (!kf.preview) continue;
    const base = path.basename(kf.path);
    if (base === "package.json") {
      const d = detectFromPackageJson(kf.preview);
      frameworks = mergeDetections(frameworks, d.frameworks);
      entryPoints = mergeDetections(entryPoints, d.entryPoints);
    } else if (base === "requirements.txt") {
      const d = detectFromRequirements(kf.preview);
      frameworks = mergeDetections(frameworks, d.frameworks);
    } else if (base === "pyproject.toml") {
      const d = detectFromPyProject(kf.preview);
      frameworks = mergeDetections(frameworks, d.frameworks);
      entryPoints = mergeDetections(entryPoints, d.entryPoints);
    }
  }

  const languages = detectLanguagesFromPaths(state.allPaths);
  const inferred = inferEntryPointsFromKeyFiles(state.keyFiles);
  entryPoints = mergeDetections(entryPoints, inferred);

  if (entryPoints.length === 0 && state.keyFiles.length > 0) {
    entryPoints = state.keyFiles.slice(0, 3).map((k) => k.path);
  }

  return {
    rootPath,
    languages,
    frameworks,
    entryPoints,
    keyFiles: state.keyFiles,
    structure,
    metadata: {
      totalFilesScanned: state.fileCount,
      maxDepth: MAX_SCAN_DEPTH,
      truncated: state.truncated,
    },
  };
}
