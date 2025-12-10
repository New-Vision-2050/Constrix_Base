import { MessageItem, MessagesGroup } from "./types";

export class MessageValidator {
  private static validateMessageItem(
    item: MessageItem,
    path: string
  ): string[] {
    const errors: string[] = [];

    if (!item.en || item.en.trim() === "") {
      errors.push(`Missing English translation at ${path}`);
    }

    if (!item.ar || item.ar.trim() === "") {
      errors.push(`Missing Arabic translation at ${path}`);
    }

    return errors;
  }

  static validateGroup(group: MessagesGroup, basePath = ""): string[] {
    const errors: string[] = [];
    const data = (group as any).data; // Access private data for validation

    for (const [key, value] of Object.entries(data)) {
      const currentPath = basePath ? `${basePath}.${key}` : key;

      if (value instanceof MessagesGroup) {
        errors.push(...this.validateGroup(value, currentPath));
      } else {
        errors.push(
          ...this.validateMessageItem(value as MessageItem, currentPath)
        );
      }
    }

    return errors;
  }
}

// Development helper to check for missing translations
export function validateMessages(group: MessagesGroup): void {
  if (process.env.NODE_ENV === "development") {
    const errors = MessageValidator.validateGroup(group);
    if (errors.length > 0) {
      console.warn("Message validation errors:", errors);
    }
  }
}
