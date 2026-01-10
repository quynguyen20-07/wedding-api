import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

// Helper để tạo logger mà không trigger File constructor ở prod
const createLogger = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isProd
        ? winston.format.combine(winston.format.json()) // JSON structured cho Vercel Logs
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
    }),
  ];

  // Chỉ thêm File transports nếu KHÔNG phải production (local dev)
  if (!isProd) {
    // Import và định nghĩa File ở đây để tránh constructor chạy ở prod
    const { File } = winston.transports;

    transports.push(
      new File({
        filename: "logs/error.log",
        level: "error",
      }),
      new File({
        filename: "logs/combined.log",
      })
    );
  }

  return winston.createLogger({
    level: isProd ? "info" : "debug",
    format: isProd
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json()
        )
      : winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.printf(
            ({ level, message, timestamp, stack, ...meta }) => {
              let log = `[${timestamp}] ${level}: ${message}`;
              if (stack) log += `\n${stack}`;
              if (Object.keys(meta).length > 0)
                log += `\nMETA: ${JSON.stringify(meta, null, 2)}`;
              return log;
            }
          )
        ),
    transports,
    exitOnError: false,
  });
};

const logger = createLogger();

export default logger;
