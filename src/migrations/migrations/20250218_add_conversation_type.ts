// migrations/20231010123456_add-conversation-type.js
import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  // Add the conversation_type column
  pgm.addColumn("conversation", {
    conversation_type: {
      type: "text",
      notNull: true,
      default: "dm", // Default to 'dm' for existing rows
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  // Remove the conversation_type column
  pgm.dropColumn("conversation", "conversation_type");
};
