/**
 * Communication message interface
 * Represents a contact message from website visitors
 */
export interface CommunicationMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
  status: 0 | 1; // 0 = pending, 1 = replied
  created_at: string;
  updated_at?: string;
}

