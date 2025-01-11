import { NextFunction, Request, Response } from "express";
import * as stripeIntegration from "../integrations/stripe.integration";
import { createRequestError } from "../utils/error.utils";
import { StatusCodes } from "http-status-codes";

export const handleCreateIntent =
  ({ createIntent = stripeIntegration.createPaymentIntent } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      const client_secret = await createIntent(amount);

      res.json({
        status: "success",
        data: {
          clientSecret: client_secret,
        },
      });
    } catch (error) {
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          StatusCodes.BAD_GATEWAY
        )
      );
    }
  };
