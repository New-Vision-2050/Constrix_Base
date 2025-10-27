import { getClientHost } from "./get-client-host";
import { getServerHost } from "./get-server-host";
import { isDevelopment } from "./is-development";

/**
 * Universal function that works on both client and server side
 * Priority order:
 * 1. In development: NEXT_PUBLIC_X_DOMAIN from env
 * 2. Dynamic host detection (server-side or client-side)
 * 3. Fallback to env variable if dynamic detection fails
 * @returns The host string (e.g., "example.com" or "localhost:3000")
 */
export async function getCurrentHost(): Promise<string | null> {
  // In development, always use the env variable for consistency
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_X_DOMAIN || null;
  }

  // Try dynamic detection first
  let dynamicHost: string | null = null;

  // Check if we're on the server side
  if (typeof window === "undefined") {
    dynamicHost = await getServerHost();
  } else {
    // Client side
    dynamicHost = getClientHost();
  }

  // Fallback to env variable if dynamic detection fails
  return dynamicHost || process.env.NEXT_PUBLIC_X_DOMAIN || null;
}
