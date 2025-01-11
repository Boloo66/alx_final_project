import {
  IOrderBase,
  IOrderItem,
  IOrderModel,
} from "../interfaces/order.interface";
import {
  IProductBase,
  IProductQueryParams,
} from "../interfaces/product.interface";
import { StringOrObjectId } from "../models/base.model";
import ProductModel from "../models/product.model";
import { createServiceError } from "../utils/error.utils";

export const create = async (
  data: IProductBase,
  { Product = ProductModel } = {}
) => {
  const product = await Product.create(data);

  return product.toObject();
};

export const findById = async (
  id: StringOrObjectId,
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const product = await Product.findById(id).orFail(error);

  return product;
};

export const findAllCategories = async ({ Product = ProductModel } = {}) => {
  const error = createServiceError(
    "Product categories not found",
    "PRODUCT_CATEGORY_NOT_FOUND_ERROR"
  );

  const categories = await Product.distinct("category").orFail(error);

  return categories;
};

export const findByIdAndUpdate = async (
  id: StringOrObjectId,
  update: Partial<IProductBase>,
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  ).orFail(error);

  return product.toObject();
};

export const findByIdAndDelete = async (
  id: StringOrObjectId,
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { deletedAt: new Date() } },
    { new: true }
  ).orFail(error);
};

export const findAll = async (
  params: IProductQueryParams,
  { Product = ProductModel } = {}
) => {
  const {
    limit = 10,
    page = 1,
    //sortBy = "-updatedAt",
    category,
    search,
  } = params;

  const regex = search
    ? new RegExp(
        ".*" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ".*",
        "i"
      )
    : null;

  const query = {
    ...(category && { category }),
    ...(regex && {
      $or: [{ name: { $regex: regex } }, { category: { $regex: regex } }],
    }),
  };

  const paginatedProducts = await Product.paginate(query, {
    page,
    limit,
    sort: { createdAt: -1 },
  });

  const { docs, ...meta } = paginatedProducts;

  return {
    ...meta,
    docs,
  };
};

export const findAllByUserId = async (
  userId: StringOrObjectId,
  params: Partial<IProductQueryParams>,
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const { page = 1, limit = 10 } = params;

  const skip = (page - 1) * limit;

  const products = await Product.find({ userId }).limit(limit).skip(skip);
  //.populate("user", "name ");

  return products;
};

export const stockIsAvailable = async (
  orderItems: Omit<IOrderItem, "price">[],
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const result = await Promise.all(
    orderItems.map(async ({ productId, quantity }) => {
      const product = await Product.findById(productId);

      if (!product) {
        throw createServiceError(
          "Product not found",
          "PRODUCT_NOT_FOUND_ERROR"
        );
      }

      if (product.stock - quantity < 0) {
        throw createServiceError(
          `Insufficient stock for ${product.name}`,
          "INSUFFICIENT_STOCK_ERROR"
        );
      }

      return true;
    })
  );
};

export const deductStock = async (
  listItems: Omit<IOrderItem, "price">[],
  { Product = ProductModel } = {}
) => {
  const error = createServiceError(
    "Product not found",
    "PRODUCT_NOT_FOUND_ERROR"
  );

  const result = Promise.all(
    listItems.map(async ({ productId, quantity }) => {
      const product = await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity },
      }).orFail(error);

      return product;
    })
  );
};
