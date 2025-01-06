import { z } from "zod";
import { mongoIdSchema } from "../interfaces/model.interface";

export const createCouponBody = z.object({
  code: z.string(),
  userCount: z.number().positive().min(1).max(100),
  discount: z.number().positive().min(0).max(100),
  expiresAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().min(new Date())
  ),
  startDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date().min(new Date())
    )
    .optional(),
});

export const couponQueryParams = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const couponParams = z.object({
  id: mongoIdSchema,
});

export const getCouponQuery = z.object({
  code: z.string(),
});
