const STORAGE_PREFIX = "construction-import-log-id:";

export function getLastImportConstructionId(
  projectId: string | number | undefined | null,
): string | null {
  if (projectId == null || typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
  } catch {
    return null;
  }
}

export function setLastImportConstructionId(
  projectId: string | number | undefined | null,
  importId: string | null | undefined,
): void {
  if (projectId == null || !importId || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, importId);
  } catch {
    // ignore storage errors
  }
}

export function extractImportConstructionId(
  body: unknown,
): string | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
  const candidates = [record, record.payload, record.data];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const importId = (candidate as { import_id?: unknown }).import_id;
    if (typeof importId === "string" && importId.trim()) {
      return importId.trim();
    }
  }

  return null;
}
