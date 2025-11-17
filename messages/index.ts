import { messagesStructure } from "./structure";

// Merge the structured messages with JSON file messages
const enFromStructure = messagesStructure.getEn();
const arFromStructure = messagesStructure.getAr();

// Combine structure-based messages with JSON messages
// JSON messages take precedence
const en = {
  ...enFromStructure,
};

const ar = {
  ...arFromStructure,
};

export const messages = {
  en,
  ar,
} as const;

export type Locale = keyof typeof messages;
export type Messages = typeof en;

// Export the structure for direct access to message groups if needed
export { messagesStructure } from "./structure";
export { _m, MessagesGroup } from "./types";
export type { MessageItem, MessageGroupData } from "./types";
