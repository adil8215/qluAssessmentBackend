export interface Message {
  message_id: number;
  conversation_id?: number | null; // Optional if not always provided
  sender_id: number;
  receiver_id?: number | null; // Optional for direct messages
  message_text?: string | null;
  message_type?: string | null;
  read_at?: Date | null;
  created_at: Date;
}
