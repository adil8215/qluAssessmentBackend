"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (pgm) => {
    // Add the conversation_type column
    pgm.addColumn("conversation", {
        conversation_type: {
            type: "text",
            notNull: true,
            default: "dm", // Default to 'dm' for existing rows
        },
    });
};
exports.up = up;
const down = (pgm) => {
    // Remove the conversation_type column
    pgm.dropColumn("conversation", "conversation_type");
};
exports.down = down;
