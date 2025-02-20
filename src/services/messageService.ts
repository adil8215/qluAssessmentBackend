import client from "../db";

export const createMessage = async (
  conversationId: number,
  senderId: number,
  receiverId: number,
  messageText: string,
  messageType: string
) => {
  const query = `
    INSERT INTO message (conversation_id, sender_id, receiver_id, message_text, message_type) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;
  const { rows } = await client.query(query, [
    conversationId,
    senderId,
    receiverId,
    messageText,
    messageType,
  ]);
  return rows[0];
};

// export const getMessagesByConversation = async (conversationId: number) => {
//   const query = `SELECT * FROM message WHERE conversation_id = $1 ORDER BY created_at ASC;`;
//   const { rows } = await client.query(query, [conversationId]);
//   return rows;
// };

// export const getMessagesByConversation = async (conversationId: number) => {
//   const query = `
//       SELECT *
//       FROM message m
//       JOIN users u ON m.sender_id = u.id
//       WHERE m.conversation_id = $1
//       ORDER BY m.created_at ASC;
//     `;

//   const { rows } = await client.query(query, [conversationId]);
//   return rows;
// };

export const getMessagesByConversation = async (conversationId: number) => {
  const query = `
      SELECT 
        m.message_id,
        m.sender_id,
        m.receiver_id,
        m.message_text,
        m.message_type,
        m.read_at,
        m.created_at,
        u.name,
        u.img_url
      FROM message m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC;
    `;

  const { rows } = await client.query(query, [conversationId]);
  return rows;
};

export const getUnreadMessages = async (receiverId: number) => {
  const query = `SELECT * FROM message WHERE receiver_id = $1 AND read_at IS NULL;`;
  const { rows } = await client.query(query, [receiverId]);
  return rows;
};

export const markMessageAsRead = async (messageId: number) => {
  const query = `
    UPDATE message 
    SET read_at = NOW() 
    WHERE message_id = $1 
    RETURNING *;
  `;
  const { rows } = await client.query(query, [messageId]);
  return rows[0];
};

export const deleteMessage = async (messageId: number) => {
  const query = `DELETE FROM message WHERE message_id = $1 RETURNING *;`;
  const { rows } = await client.query(query, [messageId]);
  return rows[0];
};
