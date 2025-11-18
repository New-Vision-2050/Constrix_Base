// Helper function to create message objects with en and ar translations
export function _m(en: string, ar: string): { en: string; ar: string } {
  return { en, ar };
}

export type MessageItem = { en: string; ar: string };

export type MessageGroupData = Record<string, MessagesGroup | MessageItem>;

export type Locale = "en" | "ar";

// Recursive type for extracted messages
export type ExtractedMessages = {
  [key: string]: string | ExtractedMessages;
};

// MessagesGroup class to handle tree structure of messages
export class MessagesGroup {
  private data: MessageGroupData;

  constructor(data: MessageGroupData) {
    this.data = data;
  }

  // Extract English messages
  getEn(): ExtractedMessages {
    const result: ExtractedMessages = {};

    for (const [key, value] of Object.entries(this.data)) {
      if (value instanceof MessagesGroup) {
        result[key] = value.getEn();
      } else {
        result[key] = value.en;
      }
    }

    return result;
  }

  // Extract Arabic messages
  getAr(): ExtractedMessages {
    const result: ExtractedMessages = {};

    for (const [key, value] of Object.entries(this.data)) {
      if (value instanceof MessagesGroup) {
        result[key] = value.getAr();
      } else {
        result[key] = value.ar;
      }
    }

    return result;
  }

  // Extract messages for a specific language
  getLang(locale: Locale): ExtractedMessages {
    const result: ExtractedMessages = {};

    for (const [key, value] of Object.entries(this.data)) {
      if (value instanceof MessagesGroup) {
        result[key] = value.getLang(locale);
      } else {
        result[key] = value[locale];
      }
    }

    return result;
  }

  // Get a specific message group or item
  get(key: string): MessagesGroup | MessageItem | undefined {
    return this.data[key];
  }

  // Add a new message group or item
  set(key: string, value: MessagesGroup | MessageItem): void {
    this.data[key] = value;
  }
}
