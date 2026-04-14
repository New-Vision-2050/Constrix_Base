export function describeClientRequestBroadcast(payload: unknown): {
  title: string | null;
  description: string | null;
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { title: null, description: null };
  }
  const p = payload as Record<string, unknown>;
  const serial =
    typeof p.serial_number === "string" ? p.serial_number.trim() : null;

  let typeName: string | null = null;
  const crt = p.client_request_type;
  if (crt && typeof crt === "object" && crt !== null && "name" in crt) {
    const n = (crt as { name?: unknown }).name;
    if (typeof n === "string" && n.trim()) typeName = n.trim();
  }

  let clientName: string | null = null;
  const client = p.client;
  if (client && typeof client === "object" && client !== null && "name" in client) {
    const n = (client as { name?: unknown }).name;
    if (typeof n === "string" && n.trim()) clientName = n.trim();
  }

  const status =
    typeof p.status_client_request === "string"
      ? p.status_client_request.trim()
      : null;

  const title =
    serial && typeName
      ? `${typeName} · ${serial}`
      : typeName || serial || null;

  const description =
    [clientName, status].filter(Boolean).join(" · ") || null;

  return { title, description };
}
