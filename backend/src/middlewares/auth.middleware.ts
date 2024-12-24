import { NextFunction, Request, Response } from "express";
import * as hashUtils from "../utils/hash.utils";
import { StatusCodes } from "http-status-codes";
import { createRequestError, createServiceError } from "../utils/error.utils";
import getEnv from "../config/env.config";
import { ERole } from "../interfaces/user.interface";

const { JWT_ADMIN_SECRET } = getEnv();

export const isAuthenticatedAdmin =
  ({
    decodeToken = hashUtils.verifyBearerToken,
    secret = JWT_ADMIN_SECRET,
  } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw createServiceError(
          "Missing authorization",
          "MISSING_AUTH_HEADER_ERROR"
        );
      }

      const token = authorization.split(" ")[1];
      const decodedToken = decodeToken(token, {
        secret,
      });

      if (!decodedToken || decodedToken.role !== ERole.ADMIN) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      req.jwtUser = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role,
      };

      next();
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        MISSING_AUTH_HEADER_ERROR: StatusCodes.PRECONDITION_FAILED,
        INVALID_TOKEN_ERROR: StatusCodes.UNAUTHORIZED,
      };
      next(
        createRequestError(
          (error as Error).message || "Not authorized",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const isAuthenticatedUser =
  ({ decodeToken = hashUtils.verifyBearerToken } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw createServiceError(
          "Missing authorization",
          "MISSING_AUTH_HEADER_ERROR"
        );
      }

      const token = authorization.split(" ")[1];
      const decodedToken = decodeToken(token);

      if (!decodedToken || decodedToken.role !== ERole.USER) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      req.jwtUser = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role,
      };

      next();
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        MISSING_AUTH_HEADER_ERROR: StatusCodes.PRECONDITION_FAILED,
        INVALID_TOKEN_ERROR: StatusCodes.UNAUTHORIZED,
      };
      next(
        createRequestError(
          (error as Error).message || "Not authorized",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };
