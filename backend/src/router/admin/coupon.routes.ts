import { Router } from "express";
import { isAuthenticatedAdmin } from "../../middlewares/auth.middleware";
import validateSchema from "../../request-schemas";
import * as couponSchema from "../../request-schemas/coupon.schema";
import * as couponController from "../../controllers/coupon.controller";

const couponRoute = Router();

couponRoute.use(isAuthenticatedAdmin());

couponRoute.post(
  "/",
  validateSchema(couponSchema.createCouponBody, "body"),
  couponController.handleCreate()
);

couponRoute.get(
  "/",
  validateSchema(couponSchema.couponQueryParams, "query"),
  couponController.handleGetAllCoupons()
);

couponRoute.get(
  "/code",
  validateSchema(couponSchema.getCouponQuery, "query"),
  couponController.handleGetCoupon()
);

export default couponRoute;
