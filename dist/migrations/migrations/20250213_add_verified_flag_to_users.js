"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (pgm) => {
    // Add a new column "verified_flag" to the "users" table.
    pgm.addColumn("users", {
        verified_flag: {
            type: "boolean",
            notNull: true,
            default: false,
        },
    });
};
exports.up = up;
const down = (pgm) => {
    // Remove the "verified_flag" column if rolling back.
    pgm.dropColumn("users", "verified_flag");
};
exports.down = down;
