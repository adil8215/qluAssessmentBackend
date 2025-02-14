import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("user_group", {
    user_id: { type: "integer", notNull: true },
    group_id: { type: "integer", notNull: true },
    role: { type: "text" },
  });

  // Composite primary key
  pgm.addConstraint("user_group", "user_group_pk", {
    primaryKey: ["user_id", "group_id"],
  });

  // Foreign key to users table
  pgm.addConstraint("user_group", "user_group_user_fk", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  // Foreign key to groups table
  pgm.addConstraint("user_group", "user_group_group_fk", {
    foreignKeys: {
      columns: "group_id",
      references: "groups(group_id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("user_group");
};
