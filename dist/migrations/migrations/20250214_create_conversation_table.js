"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (pgm) => {
    pgm.createTable("conversation", {
        conversation_id: { type: "serial", primaryKey: true },
        group_id: { type: "integer" },
        participants: { type: "integer[]", notNull: true },
        last_message_id: { type: "integer" },
        unread_count: { type: "integer", default: 0 },
        status: { type: "text" },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
    pgm.addConstraint("conversation", "conversation_group_fk", {
        foreignKeys: {
            columns: "group_id",
            references: "groups(group_id)",
            onDelete: "CASCADE",
        },
    });
    // Foreign key constraint for last_message_id to reference the message table
    pgm.addConstraint("conversation", "conversation_last_message_fk", {
        foreignKeys: {
            columns: "last_message_id",
            references: "message(message_id)",
            onDelete: "CASCADE",
        },
    });
};
exports.up = up;
const down = (pgm) => {
    pgm.dropTable("conversation");
};
exports.down = down;
