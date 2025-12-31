"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticateGraphQL = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new AppError_1.AppError("User not found", 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new AppError_1.AppError("Invalid token", 401));
    }
};
exports.authenticate = authenticate;
const authenticateGraphQL = async (context) => {
    const { token } = context;
    if (!token) {
        throw new AppError_1.AppError("Authentication required", 401);
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await User_1.User.findById(decoded.userId);
    if (!user || !user.isActive) {
        throw new AppError_1.AppError("User not found", 401);
    }
    return user;
};
exports.authenticateGraphQL = authenticateGraphQL;
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