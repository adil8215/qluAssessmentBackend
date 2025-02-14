import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("groups", {
    group_id: { type: "serial", primaryKey: true },
    group_name: { type: "text", notNull: true },
    group_desc: { type: "text" },
    group_status: { type: "text" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("groups");
};
