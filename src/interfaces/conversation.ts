export interface Conversation {
  conversation_id: number;
  group_id?: number | null; // Optional since it may be null
  participants: number[];
  last_message_id?: number | null; // Optional foreign key to the message table
  unread_count: number;
  status?: string | null; // Optional text field
  created_at: Date;
  conversation_type: string;
}
