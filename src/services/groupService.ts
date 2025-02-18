import client from "../db"; // Assuming you are using pg-promise or knex

// Create a new group
export const createGroup = async (
  groupName: string,
  groupDesc: string | undefined,
  groupStatus: string,
  createdBy: number | string
) => {
  const query = `
    INSERT INTO groups (group_name, group_desc, group_status, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [groupName, groupDesc, groupStatus, createdBy];
  const { rows } = await client.query(query, values);
  return rows[0];
};

// Get group by ID
export const getGroupById = async (groupId: number) => {
  const query = `
    SELECT * FROM groups WHERE group_id = $1;
  `;
  const { rows } = await client.query(query, [groupId]);
  return rows[0] || null;
};

// Get all groups
export const getAllGroups = async () => {
  const query = `
    SELECT * FROM groups ORDER BY created_at DESC;
  `;
  const { rows } = await client.query(query);
  return rows;
};

// Update a group's details
export const updateGroup = async (
  groupId: number,
  groupName: string,
  groupDesc: string | undefined,
  groupStatus: string
) => {
  const query = `
    UPDATE groups
    SET group_name = $1, group_desc = $2, group_status = $3, updated_at = current_timestamp
    WHERE group_id = $4
    RETURNING *;
  `;
  const values = [groupName, groupDesc, groupStatus, groupId];
  const { rows } = await client.query(query, values);
  return rows[0];
};

// Delete a group by ID
export const deleteGroup = async (groupId: number) => {
  const query = `
    DELETE FROM groups WHERE group_id = $1 RETURNING *;
  `;
  const { rows } = await client.query(query, [groupId]);
  return rows[0];
};

export const getUserGroups = async (userId: number) => {
  const query = `
    SELECT g.*
    FROM groups g
    JOIN user_group ug ON g.group_id = ug.group_id
    WHERE ug.user_id = $1
    ORDER BY g.created_at DESC;
  `;
  const { rows } = await client.query(query, [userId]);
  return rows;
};
