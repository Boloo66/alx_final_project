import { AggregatePaginateModel, model, PaginateModel, Schema } from "mongoose";
import {
  EOrderStatus,
  IOrderItem,
  IOrderModel,
  IShippingLocation,
} from "../interfaces/order.interface";
import { mergeWithBaseSchema } from "./base.model";

const shippingLocationSchema = new Schema<IShippingLocation>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { versionKey: false, _id: false, id: false, timestamps: false }
);

const orderItemsSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: false, default: null },
    name: { type: String, required: false },
    image: { type: String, required: false },
  },
  { versionKey: false, _id: false, id: false, timestamps: false }
);

let orderSchema = new Schema<IOrderModel>({
  userId: { type: Schema.Types.ObjectId, required: true },
  subtotal: { type: Number, required: false },
  total: { type: Number, required: true },
  tax: { type: Number, required: true },
  shippingfee: { type: Number, required: false },
  shippingLocation: { type: shippingLocationSchema, required: true },
  orderItems: [{ type: orderItemsSchema, required: true }],
  discount: { type: Number, required: false },
  status: {
    type: String,
    enum: EOrderStatus,
    default: EOrderStatus.PROCESSING,
    required: false,
  },
});

// orderSchema.pre("save", async function (next) {
//   const order = this as IOrderBase;

//   await this.populate("orderItems.productId");

//   const calculatedSubtotal = order.orderItems.reduce((total, item) => {
//     return (
//       total +
//       item.quantity * ((item.product as Partial<IProductBase>)?.price || 0)
//     ); // this should be from the virtual ref product;
//   }, 0);

//   order.subtotal = calculatedSubtotal;

//   order.total = order.subtotal + order.shippingfee - order.discount;
//   next();
// });

orderSchema.pre("find", function (next) {
  this.where({
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
  });
  next();
});

orderSchema.pre("findOne", function (next) {
  this.where({
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
  });
  next();
});

orderSchema.pre("findOneAndUpdate", function (next) {
  this.where({
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
  });
  next();
});

orderSchema = mergeWithBaseSchema(orderSchema, true, true);

orderItemsSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

interface IPaginateModel
  extends PaginateModel<IOrderModel>,
    AggregatePaginateModel<IOrderModel> {}

const OrderModel = model<IOrderModel, IPaginateModel>("Order", orderSchema);

export default OrderModel;
