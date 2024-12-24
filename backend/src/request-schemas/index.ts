import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";
import logger from "../utils/logger.utils";
import { StatusCodes } from "http-status-codes";

/**
 * Validate the request data against a schema object
 * @param schema - The schema object to validate
 * @param property - The property to validate against
 * @returns
 */
export const validateSchema =
  (schema: Schema, property: "query" | "body" | "params") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const valid = await schema.parseAsync(req[property]);
      req[property] = valid;
      next();
    } catch (error) {
      logger.info(error);
      const errors: Record<string, string> = {};

      (error as ZodError).errors.forEach((err) => {
        const path = err.path[0];

        errors[path] = err.message;
      });

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid request data",
        errors,
      });
    }
  };

export default validateSchema;
