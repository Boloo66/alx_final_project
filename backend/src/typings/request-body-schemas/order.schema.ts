import * as orderSchema from "../../request-schemas/order.schema";
import { z } from "zod";

declare module "../../request-schemas/order.schema" {
  export type TOrderSchemaBody = z.infer<
    typeof orderSchema.createOrderBodySchema
  >;
  export type TOrderSchemaQuery = z.infer<
    typeof orderSchema.getOrderQueryParams
  >;
}
