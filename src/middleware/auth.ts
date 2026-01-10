import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * ===============================
 * CORE: verify token & get user
 * ===============================
 */
const verifyTokenAndGetUser = async (authenticate?: string) => {
  if (!authenticate) {
    throw new AppError("Authentication required", 401);
  }

  const token = authenticate.startsWith("Bearer ")
    ? authenticate.replace("Bearer ", "").trim()
    : authenticate;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (!user.isActive) {
      throw new AppError("User is inactive", 403);
    }

    return user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }

    if (error instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }

    if (error instanceof AppError) {
      throw error;
    }

    logger.error("JWT verify failed", { error });
    throw new AppError("Authentication failed", 401);
  }
};

/**
 * ===============================
 * EXPRESS – AUTH REQUIRED
 * ===============================
 */
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();

    const user = await verifyTokenAndGetUser(token);

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Invalid token", 401));
  }
};

/**
 * ===============================
 * GRAPHQL – AUTH REQUIRED
 * ===============================
 */
export const authenticateGraphQL = async (context: any) => {
  const user = await verifyTokenAndGetUser(context.token);

  if (!user) {
    throw new AppError("Authentication required", 401);
  }

  return user;
};

/**
 * ===============================
 * GRAPHQL – AUTH OPTIONAL
 * ===============================
 */
export const authOptionalFriendlyGraphQL = async (context: any) => {
  try {
    return await verifyTokenAndGetUser(context.token);
  } catch {
    return null;
  }
};

/**
 * ===============================
 * ROLE AUTHORIZATION (EXPRESS)
 * ===============================
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};
