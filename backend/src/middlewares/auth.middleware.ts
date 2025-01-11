import { NextFunction, Request, Response } from "express";
import * as hashUtils from "../utils/hash.utils";
import { StatusCodes } from "http-status-codes";
import { createRequestError, createServiceError } from "../utils/error.utils";
import getEnv from "../config/env.config";
import { ERole, EUserStatus } from "../interfaces/user.interface";
import * as userService from "../services/user.service";

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

      const token = authorization.trim().split(" ")[1].trim();
      const decodedToken = decodeToken(token, secret);
      if (!decodedToken || decodedToken.role !== ERole.ADMIN) {
        throw createServiceError("Not Authorized", "INVALID_TOKEN_ERROR");
      }

      req.jwtAdmin = {
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
      const { JWT_SECRET: secret } = getEnv();
      const decodedToken = decodeToken(token, secret);

      if (!decodedToken || decodedToken.role !== ERole.USER) {
        throw createServiceError("Not Authorized", "INVALID_TOKEN_ERROR");
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

export const isActiveUser =
  ({ getUser = userService.findByEmail } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const { status } = await getUser(email);

      if (status !== EUserStatus.ACTIVE) {
        throw createServiceError(
          "Please verify your email",
          "VERIFY_EMAIL_ERROR"
        );
      }

      next();
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        VERIFY_EMAIL_ERROR: StatusCodes.PRECONDITION_FAILED,
      };

      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };
