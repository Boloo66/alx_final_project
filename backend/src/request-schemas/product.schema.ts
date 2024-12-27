import { z } from "zod";
import { mongoIdSchema } from "../interfaces/model.interface";

export const createProductSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.number().positive(),
  stock: z.number().positive(),
  //userId: mongoIdSchema,
  category: z.string(),
  images: z.array(z.string()),
  description: z.string().min(5),
});

export const getProductParamSchema = z.object({
  id: mongoIdSchema,
});

export const getProductQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["-updatedAt", "+updatedAt"]).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    price: z.number().positive().optional(),
    stock: z.number().positive().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    description: z.string().min(5).optional(),
  })
  .refine((value) => Object.values(value).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });
