import { NextFunction, Request, Response } from "express";
import * as productService from "../services/product.service";
import { createRequestError } from "../utils/error.utils";
import { StatusCodes } from "http-status-codes";
import { StringOrObjectId } from "../models/base.model";
import { IProductQueryParams } from "../interfaces/product.interface";
import errorMap from "zod/lib/locales/en";

export const handleCreate =
  ({ createProduct = productService.create } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await createProduct(req.body);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (error) {
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  };

export const handleUpdateProduct =
  ({ updateProduct = productService.findByIdAndUpdate } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const product = await updateProduct(id, req.body);

      res.json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (error) {
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  };

export const handleDeleteProduct =
  ({ deleteProduct = productService.findByIdAndDelete } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      await deleteProduct(id, req.body);

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  };
export const handleListAllProducts =
  ({ getProducts = productService.findAll } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: IProductQueryParams = req.query;

      const { docs, ...meta } = await getProducts(query);

      res.json({
        status: "success",
        meta,
        data: {
          product: docs.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            images: product.images,
            // userId: product.user.name,
          })),
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        PRODUCT_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message || "INternal server Error",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleListProductByUserId =
  (
    userId: StringOrObjectId,
    { listUserProduct = productService.findAllByUserId } = {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: IProductQueryParams = req.query;

      const products = await listUserProduct(userId, query);

      res.json({
        status: "success",
        data: {
          product: products.map((product) => ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            // userId: product.user.name,
          })),
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        PRODUCT_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message || "INternal server Error",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleListByProductId =
  ({ getProduct = productService.findById } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const products = await getProduct(id);

      res.json({
        status: "success",
        data: {
          product: products,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        PRODUCT_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message || "INternal server Error",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleListAllCategories =
  ({ getProduct = productService.findAllCategories } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await getProduct();

      res.json({
        status: "success",
        data: {
          categories,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        PRODUCT_CATEGORY_NOT_FOUND: StatusCodes.NOT_FOUND,
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
