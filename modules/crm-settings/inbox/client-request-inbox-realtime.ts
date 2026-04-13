/**
 * Private channel per user for client-request broadcasts.
 * Backend: `client-request.{user_id}`
 */
export function getClientRequestUserChannelName(userId: string): string {
  return `client-request.${userId}`;
}

/**
 * Echo `.listen()` event names. Laravel broadcasts use a leading dot.
 * @see event `client-request.status-changed` → listen as `.client-request.status-changed`
 */
export const CLIENT_REQUEST_INBOX_ECHO_EVENTS = [
  ".client-request.created",
  ".client-request.status-changed",
] as const;
