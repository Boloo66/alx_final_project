import { ICouponBase } from "../interfaces/coupon.interface";
import CouponModel from "../models/coupon.model";
import { createServiceError } from "../utils/error.utils";

export const create = async (
  data: ICouponBase,
  { Coupon = CouponModel } = {}
) => {
  try {
    const coupon = await Coupon.create(data);

    return coupon.toObject();
  } catch (error) {
    if ((error as { code: number }).code === 11000) {
      throw createServiceError(
        "Coupon code already taken",
        "DUPLICATE_COUPON_CODE_ERROR"
      );
    }
    throw error;
  }
};

export const get = async (
  query: { page: number; limit: number },
  { Coupon = CouponModel } = {}
) => {
  try {
    const { page = 1, limit = 10 } = query;

    const error = createServiceError(
      "Coupon not found",
      "COUPON_NOT_FOUND_ERROR"
    );

    const coupons = await Coupon.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .orFail(error);

    return coupons;
  } catch (error) {
    throw error;
  }
};

export const getByCode = async (
  code: string,
  { Coupon = CouponModel } = {}
) => {
  try {
    const coupon = await Coupon.findOne({ code: code });

    if (!coupon) {
      throw createServiceError("Coupon not found", "COUPON_NOT_FOUND_ERROR");
    }

    return coupon.toObject();
  } catch (error) {
    throw error;
  }
};

export const updateOneByCode = async (
  code: string,
  data: Partial<ICouponBase>,
  { Coupon = CouponModel } = {}
) => {
  try {
    const coupon = await Coupon.findOneAndUpdate({ code }, { $set: { data } });

    if (!coupon) {
      throw createServiceError("Coupon not found", "COUPON_NOT_FOUND_ERROR");
    }

    return coupon.toObject();
  } catch (error) {
    throw error;
  }
};

export const isValidCoupon = async (
  code: string,
  { Coupon = CouponModel } = {}
) => {
  const notFoundError = createServiceError(
    "Coupon not found",
    "COUPON_NOT_FOUND_ERROR"
  );
  const InvalidError = createServiceError(
    "Coupon invalid or expired",
    "INVALID_COUPON_ERROR"
  );
  const limitError = createServiceError(
    "Coupon limit exceeded",
    "COUPON_LIMIT_ERROR"
  );

  const coupon = await Coupon.findOne({
    code,
    startDate: { $lte: new Date() },
  }).orFail(notFoundError);

  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw InvalidError;
  if (coupon.userCount !== undefined && coupon.userCount < 0) throw limitError;
};
