import { Types } from "mongoose";
import { z } from "zod";
import { mongoIdSchema } from "../interfaces/model.interface";

export const registerUser = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z0-9])(?=.*[@#$%&^*|_ ])[a-zA-Z0-9@#$%&^*|]{8,}$/,
      "Password too weak"
    ),
  redirectPath: z.string().regex(/^\/([^/])+/), // /path1/path2
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const verifyCodeSchema = z.object({
  id: mongoIdSchema,
  code: z.string(),
  email: z.string().email(),
});

export const completeRegSchema = z.object({
  id: mongoIdSchema,
});

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

export const updatePasswordBodySchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z0-9])(?=.*[@#$%&^*_| ])[a-zA-Z0-9@#$%&^*|]{8,}$/,
      "Password too weak"
    ),
});

export const updatePasswordParamSchema = z.object({
  id: z.string().transform((val, ctx) => {
    if (!Types.ObjectId.isValid(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid ID",
        path: ctx.path,
      });
      return z.NEVER;
    }
    return val;
  }),
});

export const requestNewCodeSchema = z.object({
  email: z.string().email(),
  redirectPath: z.string().regex(/^\/([^/]+\/?)+$/),
});
