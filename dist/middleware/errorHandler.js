"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const __1 = require("..");
const errorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof __1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    __1.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode,
    });
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map