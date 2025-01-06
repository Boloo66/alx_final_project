import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/order.service";
import * as productService from "../services/product.service";
import * as orderRequestSchema from "../request-schemas/order.schema";
import { StatusCodes } from "http-status-codes";
import { createRequestError } from "../utils/error.utils";
import { ParsedUrlQuery } from "querystring";
import { StringOrObjectId } from "../models/base.model";

export const handleCreate =
  ({
    createOrder = orderService.create,
    ensureStockIsPositive = productService.stockIsAvailable,
    deductStock = productService.deductStock,
  } = {}) =>
  async (
    req: Request<object, object, orderRequestSchema.TOrderSchemaBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderItems, ...commonItems } = req.body;

      await ensureStockIsPositive(orderItems);

      const order = await createOrder({
        ...commonItems,
        orderItems,
        userId: req.jwtUser!.id,
      });

      await deductStock(orderItems);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
          order,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        INSUFFICIENT_STOCK_ERROR: StatusCodes.PRECONDITION_FAILED,
        PRODUCT_NOT_FOUND: StatusCodes.NOT_FOUND,
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

export const handleGetAllOrders =
  ({ getOrders = orderService.findAll } = {}) =>
  async (
    req: Request<
      {},
      {},
      {},
      orderRequestSchema.TOrderSchemaQuery & ParsedUrlQuery,
      {}
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;

      const { docs, ...metadata } = await getOrders({ page, limit });

      res.json({
        status: "success",
        metadata: metadata,
        data: {
          orders: docs.map((doc) => {
            return {
              id: doc.id,
              subtotal: doc.subtotal,
              total: doc.total,
              tax: doc.tax,
              discount: doc.discount,
              shippingfee: doc.shippingfee,
              orderItems: doc.orderItems.map((item) => {
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item["product"]?.price || item.price,
                };
              }),
              userId: doc.userId,
              shippingDetails: doc.shippingLocation,
              name: doc.user?.name || null,
            };
          }),
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        ORDER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
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

export const handleGetByOrderId =
  ({ getOrder = orderService.findById } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const order = await getOrder(id);

      res.json({
        status: "success",
        data: {
          order,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        ORDER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
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

export const handleGetOrdersByUserId =
  ({ getOrders = orderService.findAll } = {}) =>
  async (
    req: Request<
      {},
      {},
      { id: StringOrObjectId },
      orderRequestSchema.TOrderSchemaQuery & ParsedUrlQuery,
      object
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;

      const id = req.body.id;

      const { docs, ...metadata } = await getOrders(
        {
          page,
          limit,
        },
        req.jwtUser?.id || id
      );

      res.json({
        status: "success",
        metadata: metadata,
        data: {
          orders: docs.map((doc) => {
            return {
              id: doc.id,
              subtotal: doc.subtotal,
              total: doc.total,
              tax: doc.tax,
              discount: doc.discount,
              shippingfee: doc.shippingfee,
              orderItems: doc.orderItems.map((item) => {
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item["product"]?.price || item.price,
                };
              }),
              userId: doc.userId,
              shippingDetails: doc.shippingLocation,
              name: doc.user?.name || null,
            };
          }),
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        ORDER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
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

export const handleDeleteOrderId =
  ({ deleteOrder = orderService.deleteOrder } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      await deleteOrder(id, req.jwtUser?.id);

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        ORDER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
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
