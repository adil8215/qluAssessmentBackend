import { MigrationBuilder } from "node-pg-migrate";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.down = exports.up = void 0;

const up = (pgm: MigrationBuilder) => {
  // Add created_by column to the groups table
  pgm.addColumn("groups", {
    created_by: {
      type: "integer",
      notNull: true,
      references: "users(id)", // Assuming the users table has user_id as primary key
      onDelete: "CASCADE", // If the user is deleted, delete all their groups
    },
  });

  // Add foreign key constraint to enforce relationship between groups and users
  pgm.addConstraint("groups", "groups_created_by_fk", {
    foreignKeys: {
      columns: "created_by",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.up = up;

const down = (pgm: MigrationBuilder) => {
  // Drop the created_by foreign key constraint and column
  pgm.dropConstraint("groups", "groups_created_by_fk");
  pgm.dropColumn("groups", "created_by");
};

exports.down = down;
