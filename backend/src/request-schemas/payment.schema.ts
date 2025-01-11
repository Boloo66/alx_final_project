import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.coerce.number().min(10),
});
