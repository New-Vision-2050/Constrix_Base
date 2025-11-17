// Enhanced message creation with interpolation support
export interface MessageWithParams {
  en: string;
  ar: string;
  params?: string[]; // Parameter names for interpolation
}

// Enhanced helper function that supports parameter tracking
export function _mp(
  en: string,
  ar: string,
  params?: string[]
): MessageWithParams {
  return { en, ar, params };
}

// Runtime message interpolation
export function interpolateMessage(
  message: string,
  params: Record<string, string | number>
): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

// Type-safe message getter with interpolation
export function getMessage(
  messageItem: MessageWithParams,
  locale: "en" | "ar",
  params?: Record<string, string | number>
): string {
  const message = messageItem[locale];
  return params ? interpolateMessage(message, params) : message;
}
