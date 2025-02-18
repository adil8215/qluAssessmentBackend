import client from "../db";

export const createAttachment = async (
  messageId: number,
  attachmentType: string,
  attachmentUrl: string
) => {
  const { rows } = await client.query(
    "INSERT INTO attachment (message_id, attachment_type, attachment_url) VALUES ($1, $2, $3) RETURNING *",
    [messageId, attachmentType, attachmentUrl]
  );
  return rows[0];
};

export const getAttachmentsByMessageId = async (messageId: number) => {
  const { rows } = await client.query(
    "SELECT * FROM attachment WHERE message_id = $1",
    [messageId]
  );
  return rows;
};

export const deleteAttachment = async (attachmentId: number) => {
  const { rows } = await client.query(
    "DELETE FROM attachment WHERE attachment_id = $1 RETURNING *",
    [attachmentId]
  );
  return rows[0];
};
