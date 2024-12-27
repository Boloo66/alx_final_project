import { Types } from "mongoose";
import { z } from "zod";
export interface IBaseModel {
  _id: Types.ObjectId;
  id: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const generateMongoId = (seed?: string) => new Types.ObjectId(seed);

export const mongoIdSchema = z.string().transform((val, ctx) => {
  if (!Types.ObjectId.isValid(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid ID",
      path: ctx.path,
    });
    return z.NEVER;
  }
  return generateMongoId(val);
});
