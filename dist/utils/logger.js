"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, errors, splat, json } = winston_1.default.format;
const isProd = process.env.NODE_ENV === "production";
/**
 * ===============================
 * DEV FORMAT – HUMAN READABLE
 * ===============================
 */
const devFormat = combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), splat(), printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (stack) {
        log += `\n${stack}`;
    }
    if (Object.keys(meta).length) {
        log += `\nMETA: ${JSON.stringify(meta, null, 2)}`;
    }
    return log;
}));
/**
 * ===============================
 * PROD FORMAT – JSON (ELK READY)
 * ===============================
 */
const prodFormat = combine(timestamp(), errors({ stack: true }), splat(), json());
/**
 * ===============================
 * LOGGER INSTANCE
 * ===============================
 */
const logger = winston_1.default.createLogger({
    level: isProd ? "info" : "debug",
    format: isProd ? prodFormat : devFormat,
    transports: [
        new winston_1.default.transports.Console(),
        // Error log
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        // All logs
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map