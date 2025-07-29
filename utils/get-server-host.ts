/**
 * Get the host on server side only (Server Components, API routes)
 * @returns The host string (e.g., "example.com" or "localhost:3000")
 */
export async function getServerHost(): Promise<string | null> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    return headersList.get("host");
  } catch (error) {
    console.log("Error getting server host:", error);
    return null;
  }
}
