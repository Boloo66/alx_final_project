import { IBaseModel } from "./model.interface";

export interface ICouponBase {
  userCount: number;
  code: string;
  discount: number;
  expiresAt: Date;
  startDate: Date;
}

export interface ICoupon extends ICouponBase {}

export interface ICouponModel extends ICoupon, IBaseModel {}
