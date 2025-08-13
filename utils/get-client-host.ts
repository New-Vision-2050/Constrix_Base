/**
 * Get the host on client side only
 * @returns The host string (e.g., "example.com" or "localhost:3000")
 */
export function getClientHost(): string | null {
  // Only works on client side
  if (typeof window === "undefined") {
    return null;
  }

  return window.location.host;
}
