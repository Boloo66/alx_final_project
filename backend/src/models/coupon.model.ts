import { model, Schema } from "mongoose";
import { ICouponModel } from "../interfaces/coupon.interface";
import { mergeWithBaseSchema } from "./base.model";

let couponSchema = new Schema<ICouponModel>({
  userCount: { type: Number, required: true, default: Infinity },
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  startDate: { type: Date, default: Date.now() },
});

couponSchema = mergeWithBaseSchema(couponSchema);

couponSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { code: { $type: "string" } } }
);

const CouponModel = model<ICouponModel>("Coupon", couponSchema);

export default CouponModel;
