import winston from "winston";

console.log("LOGGER INIT: USING ONLY CONSOLE TRANSPORT - NO FILE LOGS");

const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

const createLogger = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
    }),
  ];

  if (!isProd && !isVercel) {
    const fs = require("fs");
    const path = require("path");

    const logDir = "logs";
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(logDir, "combined.log"),
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports,
    exitOnError: false,
  });
};

const logger = createLogger();
export default logger;
