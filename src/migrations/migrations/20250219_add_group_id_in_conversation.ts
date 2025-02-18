import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  // Add the group_id column to the conversation table
  pgm.addColumn("conversation", {
    group_id: {
      type: "integer",
      references: "groups(group_id)", // Add a foreign key reference to the groups table
      onDelete: "CASCADE", // Ensure that when a group is deleted, associated conversations are also deleted
      notNull: false, // group_id can be null for direct conversations
    },
  });

  // Optionally, if you want to make group_id non-nullable after adding it, you can alter it in a separate step:
  // pgm.alterColumn("conversation", "group_id", { notNull: true });
};

export const down = (pgm: MigrationBuilder) => {
  // Drop the foreign key constraint if rolling back
  pgm.dropConstraint("conversation", "conversation_group_fk");

  // Drop the group_id column from the conversation table
  pgm.dropColumn("conversation", "group_id");
};
