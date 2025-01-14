import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    sucess: false,
    message: error.message || "Something went wrong",
    error,
  });
};

export default globalErrorHandler;
