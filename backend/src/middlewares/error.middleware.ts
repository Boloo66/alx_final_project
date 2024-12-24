import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.utils";
import { RequestError } from "../utils/error.utils";

export const notFoundErrorMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const err = `Method ${req.method.toLocaleUpperCase()} to ${
    req.path
  } not valid`;

  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message: err,
  });
};

export const errorMiddleware = (
  err: RequestError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.warn(err.stack);

  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    name: err.name,
    message: err.message || "Internal Server Error",
  });
};
