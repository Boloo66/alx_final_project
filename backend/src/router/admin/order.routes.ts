import { Router } from "express";
import { isAuthenticatedAdmin } from "../../middlewares/auth.middleware";
import * as orderController from "../../controllers/order.controller";
import validateSchema from "../../request-schemas";
import * as orderSchema from "../../request-schemas/order.schema";

const orderRouter = Router();

orderRouter.use(isAuthenticatedAdmin());

orderRouter.get(
  "/",
  validateSchema(orderSchema.getOrderQueryParams, "query"),
  orderController.handleGetAllOrders()
);

orderRouter.get(
  "/:id",
  validateSchema(orderSchema.getOrderParams, "params"),
  orderController.handleGetByOrderId()
);

orderRouter.delete(
  "/:id",
  validateSchema(orderSchema.getOrderParams, "params"),
  orderController.handleDeleteOrderId()
);
export default orderRouter;
