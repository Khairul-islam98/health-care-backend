import { Request, Response, NextFunction } from "express";
import { jwtHelpers } from "../helpars/jwtHelpers";
import config from "../config";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../errors/AppError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const verifyUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret,
      );
      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Your are Forbidden!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
