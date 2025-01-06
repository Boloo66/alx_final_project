import { NextFunction, Request, Response } from "express";
import * as couponService from "../services/coupon.service";
import { StatusCodes } from "http-status-codes";
import { createRequestError } from "../utils/error.utils";
import { ICouponBase } from "../interfaces/coupon.interface";
import { ParsedUrlQuery } from "querystring";

export const handleCreate =
  ({ create = couponService.create } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const coupon = await create(data as ICouponBase);

      res.json({
        status: "success",
        data: {
          coupon,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        INVALID_COUPON_CODE_ERROR: StatusCodes.CONFLICT,
      };

      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleGetAllCoupons =
  ({ getCoupons = couponService.get } = {}) =>
  async (
    req: Request<
      object,
      object,
      object,
      { limit: number; page: number } & ParsedUrlQuery
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit, page } = req.query;

      const coupon = await getCoupons({ limit, page });

      res.json({
        status: "success",
        data: {
          coupon,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        COUPON_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };

      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleGetCoupon =
  ({ getCoupons = couponService.getByCode } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.query;

      const coupon = await getCoupons(code as string);

      res.json({
        status: "success",
        data: {
          coupon,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        COUPON_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };

      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };
