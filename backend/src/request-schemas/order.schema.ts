import { z } from "zod";
import { mongoIdSchema } from "../interfaces/model.interface";

export const createOrderBodySchema = z.object({
  subtotal: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
  tax: z.coerce.number().positive(),
  discount: z.coerce.number().default(0).optional(),
  shippingfee: z.coerce.number().min(1).positive().default(0),
  orderItems: z.array(
    z.object({
      productId: mongoIdSchema,
      quantity: z.coerce.number().positive().min(1),
      price: z.coerce.number().positive().min(1).optional(),
    })
  ),
  shippingLocation: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zip: z.string(),
  }),
});

export const getOrderQueryParams = z.object({
  limit: z.coerce.number().positive().min(1).default(10),
  page: z.coerce.number().positive().min(1).default(1),
});

export const getOrderParams = z.object({
  id: mongoIdSchema,
});
