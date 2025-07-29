import { getClientHost } from "./get-client-host";
import { getServerHost } from "./get-server-host";
import { isDevelopment } from "./is-development";

/**
 * Universal function that works on both client and server side
 * @returns The host string (e.g., "example.com" or "localhost:3000")
 */
export async function getCurrentHost(): Promise<string | null> {
  if (isDevelopment) return process.env.NEXT_PUBLIC_X_DOMAIN || null;
  // Check if we're on the server side
  if (typeof window === "undefined") {
    return await getServerHost();
  }

  // Client side
  return getClientHost();
}
