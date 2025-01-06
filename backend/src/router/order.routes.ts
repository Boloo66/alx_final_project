import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import validateSchema from "../request-schemas";
import * as orderSchema from "../request-schemas/order.schema";
import * as orderController from "../controllers/order.controller";
const orderRoute = Router();

orderRoute.use(isAuthenticatedUser());

orderRoute.post(
  "/",
  validateSchema(orderSchema.createOrderBodySchema, "body"),
  orderController.handleCreate()
);

orderRoute.get(
  "/user/:id",
  validateSchema(orderSchema.getOrderParams, "params"),
  orderController.handleGetOrdersByUserId()
);

orderRoute.delete(
  "/user/:id",
  validateSchema(orderSchema.getOrderParams, "params"),
  orderController.handleDeleteOrderId()
);

export default orderRoute;
