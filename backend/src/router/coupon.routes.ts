import { Router } from "express";
import validateSchema from "../request-schemas";
import * as couponSchema from "../request-schemas/coupon.schema";
import * as couponController from "../controllers/coupon.controller";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";

const couponRoute = Router();

//couponRoute.use(isAuthenticatedUser());

// couponRoute.post(
//   "/",
//   validateSchema(couponSchema.createCouponBody, "body"),
//   couponController.handleCreate()
// );

// couponRoute.get(
//   "/",
//   validateSchema(couponSchema.couponQueryParams, "query"),
//   couponController.handleGetAllCoupons()
// );

couponRoute.get(
  "/confirm-code",
  validateSchema(couponSchema.getCouponQuery, "query"),
  couponController.handleGetCoupon()
);

export default couponRoute;
