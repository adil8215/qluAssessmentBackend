import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  // Add a new column "verified_flag" to the "users" table.
  pgm.addColumn("users", {
    verified_flag: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  // Remove the "verified_flag" column if rolling back.
  pgm.dropColumn("users", "verified_flag");
};
