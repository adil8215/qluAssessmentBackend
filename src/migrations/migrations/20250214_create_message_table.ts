import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("message", {
    message_id: { type: "serial", primaryKey: true },
    conversation_id: { type: "integer" }, // optional, if using separate conversation table
    sender_id: { type: "integer", notNull: true },
    receiver_id: { type: "integer" }, // explicitly store receiver for direct messages
    message_text: { type: "text" },
    message_type: { type: "text" },
    read_at: { type: "timestamp" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Add foreign key constraints
  pgm.addConstraint("message", "message_sender_fk", {
    foreignKeys: {
      columns: "sender_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("message", "message_receiver_fk", {
    foreignKeys: {
      columns: "receiver_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  // Optionally, if you are linking to a conversation table:
  pgm.addConstraint("message", "message_conversation_fk", {
    foreignKeys: {
      columns: "conversation_id",
      references: "conversation(conversation_id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("message");
};
