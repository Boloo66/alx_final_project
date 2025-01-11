import { UpdateQuery } from "mongoose";
import { IOrderBase } from "../interfaces/order.interface";
import { StringOrObjectId } from "../models/base.model";
import OrderModel from "../models/order.model";
import { createServiceError } from "../utils/error.utils";

export const create = async (data: IOrderBase, { Order = OrderModel } = {}) => {
  const order = await Order.create(data);
  await order.populate({
    path: "orderItems.product",
    select: "price name",
  });

  return order.toObject();
};

export const findById = async (
  id: StringOrObjectId,
  { Order = OrderModel } = {}
) => {
  try {
    const err = createServiceError("Order not found", "ORDER_NOT_FOUND_ERROR");
    const order = await Order.findById(id).orFail(err);

    return order;
  } catch (error) {
    throw error;
  }
};

export const findByIdAndUpdate = async (
  id: StringOrObjectId,
  update: UpdateQuery<Partial<IOrderBase>>,
  { Order = OrderModel } = {}
) => {
  try {
    const err = createServiceError("Order not found", "ORDER_NOT_FOUND_ERROR");
    const order = await Order.findByIdAndUpdate(id, { $set: update }).orFail(
      err
    );

    return order;
  } catch (error) {
    throw error;
  }
};

export const findByUserId = async (
  id: StringOrObjectId,
  { Order = OrderModel } = {}
) => {
  try {
    const err = createServiceError("Order not found", "ORDER_NOT_FOUND_ERROR");
    const order = await Order.find({ userId: id }).orFail(err);

    return order;
  } catch (error) {
    throw error;
  }
};

export const findAll = async (
  query: { limit: number; page: number },
  userId?: StringOrObjectId,

  { Order = OrderModel } = {}
) => {
  const { page, limit } = query;

  const err = createServiceError("Order not found", "ORDER_NOT_FOUND_ERROR");

  const { docs, ...metadata } = await Order.paginate(
    { ...(userId && { userId }) },
    {
      limit,
      page,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "orderItems.product", // Path to the submodel's virtual field
        },
        { path: "user", select: "name" },
      ],
    }
  );

  return {
    docs,
    page: metadata.page,
    limit: metadata.limit,
    totalDocs: metadata.totalDocs,
    totalPages: metadata.totalPages,
    hasPrevPage: metadata.hasPrevPage,
    hasNextPage: metadata.hasNextPage,
  };
};

export const deleteOrder = async (
  id: StringOrObjectId,
  userId?: StringOrObjectId,
  { Order = OrderModel } = {}
) => {
  const err = createServiceError("Order not found", "ORDER_NOT_FOUND_ERROR");

  const order = await Order.findOne({
    _id: id,
    ...(userId && { userId }),
  }).orFail(err);

  await order.updateOne({ deletedAt: new Date() });

  await order.save();
};
