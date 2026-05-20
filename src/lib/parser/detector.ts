import type { KeyFileSummary } from "@/types";

const EXT_LANGUAGE: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript/React",
  ".js": "JavaScript",
  ".jsx": "JavaScript/React",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".kt": "Kotlin",
  ".rb": "Ruby",
  ".php": "PHP",
  ".cs": "C#",
  ".vue": "Vue",
  ".svelte": "Svelte",
};

const FRAMEWORK_HINTS: Record<string, string[]> = {
  next: ["Next.js"],
  react: ["React"],
  vue: ["Vue"],
  svelte: ["Svelte"],
  express: ["Express"],
  fastify: ["Fastify"],
  nestjs: ["NestJS"],
  "@nestjs/core": ["NestJS"],
  django: ["Django"],
  flask: ["Flask"],
  fastapi: ["FastAPI"],
  "spring-boot": ["Spring Boot"],
  gin: ["Gin"],
  echo: ["Echo"],
  rails: ["Ruby on Rails"],
  laravel: ["Laravel"],
  prisma: ["Prisma"],
  drizzle: ["Drizzle ORM"],
  supabase: ["Supabase"],
  firebase: ["Firebase"],
};

export function detectLanguagesFromPaths(paths: string[]): string[] {
  const langs = new Set<string>();
  for (const p of paths) {
    const ext = p.slice(p.lastIndexOf(".")).toLowerCase();
    if (EXT_LANGUAGE[ext]) langs.add(EXT_LANGUAGE[ext]);
  }
  return [...langs];
}

export function detectFromPackageJson(content: string): {
  frameworks: string[];
  entryPoints: string[];
} {
  const frameworks = new Set<string>();
  const entryPoints: string[] = [];

  try {
    const pkg = JSON.parse(content) as Record<string, unknown>;
    const deps = {
      ...(pkg.dependencies as Record<string, string> | undefined),
      ...(pkg.devDependencies as Record<string, string> | undefined),
    };

    for (const [name] of Object.entries(deps)) {
      const hints = FRAMEWORK_HINTS[name.toLowerCase()];
      if (hints) hints.forEach((f) => frameworks.add(f));
    }

    if (deps.next) frameworks.add("Next.js");
    if (deps.react && !frameworks.has("Next.js")) frameworks.add("React");

    const main = pkg.main as string | undefined;
    if (main) entryPoints.push(main);

    const scripts = pkg.scripts as Record<string, string> | undefined;
    if (scripts?.dev?.includes("next")) frameworks.add("Next.js");
    if (scripts?.start) entryPoints.push(`npm run start (${scripts.start})`);
  } catch {
    /* ignore parse errors */
  }

  return { frameworks: [...frameworks], entryPoints };
}

export function detectFromRequirements(content: string): {
  frameworks: string[];
} {
  const frameworks = new Set<string>();
  const lower = content.toLowerCase();
  for (const [key, values] of Object.entries(FRAMEWORK_HINTS)) {
    if (lower.includes(key)) values.forEach((f) => frameworks.add(f));
  }
  return { frameworks: [...frameworks] };
}

export function detectFromPyProject(content: string): {
  frameworks: string[];
  entryPoints: string[];
} {
  const frameworks = new Set<string>();
  const entryPoints: string[] = [];
  const lower = content.toLowerCase();

  if (lower.includes("django")) frameworks.add("Django");
  if (lower.includes("fastapi")) frameworks.add("FastAPI");
  if (lower.includes("flask")) frameworks.add("Flask");

  const scriptMatch = content.match(/\[project\.scripts\][\s\S]*?(\w+)\s*=\s*"([^"]+)"/);
  if (scriptMatch) entryPoints.push(`${scriptMatch[1]}: ${scriptMatch[2]}`);

  return { frameworks: [...frameworks], entryPoints };
}

export function inferEntryPointsFromKeyFiles(
  keyFiles: KeyFileSummary[]
): string[] {
  const entries: string[] = [];
  const patterns = [
    /^src\/app\/page\.(tsx|ts|jsx|js)$/,
    /^app\/page\.(tsx|ts|jsx|js)$/,
    /^pages\/index\.(tsx|ts|jsx|js)$/,
    /^main\.py$/,
    /^app\.py$/,
    /^src\/index\.(ts|tsx)$/,
    /^index\.(ts|tsx|js)$/,
  ];

  for (const kf of keyFiles) {
    const normalized = kf.path.replace(/\\/g, "/");
    if (patterns.some((re) => re.test(normalized))) {
      entries.push(normalized);
    }
  }
  return entries;
}

export function mergeDetections(
  ...lists: (string | string[] | undefined)[]
): string[] {
  return [
    ...new Set(
      lists.flatMap((item) =>
        item === undefined ? [] : Array.isArray(item) ? item : [item]
      )
    ),
  ];
}
