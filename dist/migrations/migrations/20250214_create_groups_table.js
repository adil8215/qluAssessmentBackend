"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (pgm) => {
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
exports.up = up;
const down = (pgm) => {
    pgm.dropTable("groups");
};
exports.down = down;
