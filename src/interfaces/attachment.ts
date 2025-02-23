export interface Attachment {
  attachment_id: number;
  message_id: number;
  attachment_type?: string | null;
  attachment_url?: string | null;
  created_at: Date;
}
