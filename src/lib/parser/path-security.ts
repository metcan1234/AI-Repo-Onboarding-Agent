import fs from "fs/promises";
import path from "path";

export class PathSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PathSecurityError";
  }
}

function getAllowedRoots(): string[] | null {
  const raw = process.env.ALLOWED_SCAN_ROOTS?.trim();
  if (!raw) return null;
  return raw
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => path.resolve(r));
}

function normalizeForCompare(p: string): string {
  return path.resolve(p).replace(/\\/g, "/").toLowerCase();
}

export async function validateProjectPath(
  inputPath: string
): Promise<string> {
  if (!inputPath?.trim()) {
    throw new PathSecurityError("Proje yolu boş olamaz.");
  }

  if (inputPath.includes("\0")) {
    throw new PathSecurityError("Geçersiz karakter içeren yol.");
  }

  const resolved = path.resolve(inputPath.trim());

  if (resolved.includes("..")) {
    throw new PathSecurityError("Göreli yol manipülasyonu tespit edildi.");
  }

  const allowedRoots = getAllowedRoots();
  if (allowedRoots && allowedRoots.length > 0) {
    const normalizedResolved = normalizeForCompare(resolved);
    const allowed = allowedRoots.some((root) => {
      const normalizedRoot = normalizeForCompare(root);
      return (
        normalizedResolved === normalizedRoot ||
        normalizedResolved.startsWith(`${normalizedRoot}/`)
      );
    });
    if (!allowed) {
      throw new PathSecurityError(
        "Bu yol izin verilen kök dizinlerin dışında. ALLOWED_SCAN_ROOTS ortam değişkenini kontrol edin."
      );
    }
  }

  let stat;
  try {
    stat = await fs.stat(resolved);
  } catch {
    throw new PathSecurityError(
      "Belirtilen yol bulunamadı veya okunamıyor. Tam mutlak yolu kullanın."
    );
  }

  if (!stat.isDirectory()) {
    throw new PathSecurityError("Yol bir dizin olmalıdır.");
  }

  return resolved;
}
