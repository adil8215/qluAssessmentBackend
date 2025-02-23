// Assume you have a database connection file

import client from "../db";

export const createConversation = async (
  participants: number[],
  groupId: number | null, // Optional, could be null for direct conversations
  conversationType: string // e.g., 'direct' or 'group'
) => {
  const query = `
    INSERT INTO conversation (participants, group_id, conversation_type) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [participants, groupId, conversationType];
  const { rows } = await client.query(query, values);
  return rows[0];
};

export const findConversation = async (
  senderId: number,
  receiverId: number | undefined
) => {
  const query = `
    SELECT * FROM conversation
    WHERE participants @> ARRAY[$1, $2]::integer[]
    AND cardinality(participants) = 2
    LIMIT 1;
  `;

  const { rows } = await client.query(query, [senderId, receiverId]);
  return rows[0] || null;
};

export const findConversationByGroupId = async (groupId: number) => {
  const query = `
      SELECT * FROM conversation
      WHERE group_id = $1
      LIMIT 1;
    `;

  const { rows } = await client.query(query, [groupId]);
  return rows[0] || null;
};

export const getConversationById = async (conversationId: number) => {
  const query = `SELECT * FROM conversation WHERE conversation_id = $1`;
  const { rows } = await client.query(query, [conversationId]);
  return rows[0];
};

export const getUserConversations = async (userId: number) => {
  const query = `
    SELECT * FROM conversation 
    WHERE $1 = ANY(participants)
    ORDER BY created_at DESC;
  `;
  const { rows } = await client.query(query, [userId]);
  return rows;
};

export const updateLastMessage = async (
  conversationId: number,
  lastMessageId: number
) => {
  const query = `
      UPDATE conversation 
      SET last_message_id = $1 
      WHERE conversation_id = $2 
      RETURNING *;
    `;
  const values = [lastMessageId, conversationId];
  const { rows } = await client.query(query, values);
  return rows[0];
};

export const deleteConversation = async (conversationId: number) => {
  const query = `DELETE FROM conversation WHERE conversation_id = $1 RETURNING *;`;
  const { rows } = await client.query(query, [conversationId]);
  return rows[0];
};
