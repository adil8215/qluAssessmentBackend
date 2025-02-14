import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("attachment", {
    attachment_id: { type: "serial", primaryKey: true },
    message_id: { type: "integer", notNull: true },
    attachment_type: { type: "text" },
    attachment_url: { type: "text" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("attachment", "attachment_message_fk", {
    foreignKeys: {
      columns: "message_id",
      references: "message(message_id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("attachment");
};
