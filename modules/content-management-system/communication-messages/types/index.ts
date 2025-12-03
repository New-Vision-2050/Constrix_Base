/**
 * Communication message interface
 * Represents a contact message from website visitors
 */
export interface CommunicationMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "pending" | "replied";
  reply?: string;
  replied_at?: string;
  created_at: string;
  updated_at?: string;
}

