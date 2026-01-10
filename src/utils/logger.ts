import winston from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf, colorize, errors, splat, json } =
  winston.format;

const isProd = process.env.NODE_ENV === "production";
const isServerless = !!process.env.LAMBDA_TASK_ROOT;

const logDir = isServerless ? "/tmp/logs" : "logs";

if (!isServerless && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// DEV FORMAT – HUMAN READABLE
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;

    if (stack) log += `\n${stack}`;
    if (Object.keys(meta).length)
      log += `\nMETA: ${JSON.stringify(meta, null, 2)}`;

    return log;
  })
);

// PROD FORMAT – JSON
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  splat(),
  json()
);

// LOGGER
const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),

    ...(isServerless
      ? []
      : [
          new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
          }),
          new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
          }),
        ]),
  ],
  exitOnError: false,
});

export default logger;
