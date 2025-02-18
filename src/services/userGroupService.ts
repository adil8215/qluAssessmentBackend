import client from "../db"; // Assuming you are using pg-promise or knex

// Add a user to a group with a role
export const addUserToGroup = async (
  user_id: number,
  group_id: number,
  role: string
) => {
  const checkQuery = `
    SELECT * FROM user_group WHERE user_id = $1 AND group_id = $2;
  `;
  const { rows: existingUserGroup } = await client.query(checkQuery, [
    user_id,
    group_id,
  ]);

  if (existingUserGroup.length > 0) {
    throw new Error("User already exists in the group");
  }

  const query = `
    INSERT INTO user_group (user_id, group_id, role)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user_id, group_id, role];
  const { rows } = await client.query(query, values);
  return rows[0];
};

// Remove a user from a group
export const removeUserFromGroup = async (userId: number, groupId: number) => {
  const query = `
    DELETE FROM user_group WHERE user_id = $1 AND group_id = $2 RETURNING *;
  `;
  const { rows } = await client.query(query, [userId, groupId]);
  return rows[0];
};

// Get all users in a group
export const getUsersInGroup = async (groupId: number) => {
  const query = `
    SELECT users.*, user_group.role 
    FROM users 
    INNER JOIN user_group ON users.id = user_group.user_id
    WHERE user_group.group_id = $1;
  `;
  const { rows } = await client.query(query, [groupId]);
  return rows;
};

// Get all groups a user belongs to
export const getGroupsForUser = async (userId: number) => {
  const query = `
    SELECT groups.*, user_group.role 
    FROM groups 
    INNER JOIN user_group ON groups.group_id = user_group.group_id
    WHERE user_group.user_id = $1;
  `;
  const { rows } = await client.query(query, [userId]);
  return rows;
};
