import { Router } from "express";
import * as stripeController from "../controllers/stripe.controller";
import validateSchema from "../request-schemas";
import * as paymentSchema from "../request-schemas/payment.schema";

const paymentRouter = Router();

paymentRouter.post(
  "/intent",
  validateSchema(paymentSchema.paymentSchema, "body"),
  stripeController.handleCreateIntent()
);

export default paymentRouter;
