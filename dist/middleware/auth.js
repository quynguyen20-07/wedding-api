"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authOptionalFriendlyGraphQL = exports.authenticateGraphQL = exports.authenticate = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * ===============================
 * CORE: verify token & get user
 * ===============================
 */
const verifyTokenAndGetUser = async (authenticate) => {
    if (!authenticate) {
        throw new AppError_1.AppError("Authentication required", 401);
    }
    const token = authenticate.startsWith("Bearer ")
        ? authenticate.replace("Bearer ", "").trim()
        : authenticate;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 401);
        }
        if (!user.isActive) {
            throw new AppError_1.AppError("User is inactive", 403);
        }
        return user;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new AppError_1.AppError("Token expired", 401);
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new AppError_1.AppError("Invalid token", 401);
        }
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        logger_1.default.error("JWT verify failed", { error });
        throw new AppError_1.AppError("Authentication failed", 401);
    }
};
/**
 * ===============================
 * EXPRESS – AUTH REQUIRED
 * ===============================
 */
const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "").trim();
        const user = await verifyTokenAndGetUser(token);
        if (!user) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return next(error);
        }
        next(new AppError_1.AppError("Invalid token", 401));
    }
};
exports.authenticate = authenticate;
/**
 * ===============================
 * GRAPHQL – AUTH REQUIRED
 * ===============================
 */
const authenticateGraphQL = async (context) => {
    const user = await verifyTokenAndGetUser(context.token);
    if (!user) {
        throw new AppError_1.AppError("Authentication required", 401);
    }
    return user;
};
exports.authenticateGraphQL = authenticateGraphQL;
/**
 * ===============================
 * GRAPHQL – AUTH OPTIONAL
 * ===============================
 */
const authOptionalFriendlyGraphQL = async (context) => {
    try {
        return await verifyTokenAndGetUser(context.token);
    }
    catch {
        return null;
    }
};
exports.authOptionalFriendlyGraphQL = authOptionalFriendlyGraphQL;
/**
 * ===============================
 * ROLE AUTHORIZATION (EXPRESS)
 * ===============================
 */
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError("Authentication required", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("Insufficient permissions", 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map