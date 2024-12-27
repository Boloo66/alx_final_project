import { AggregatePaginateModel, model, PaginateModel, Schema } from "mongoose";
import { IProductModel } from "../interfaces/product.interface";
import { mergeWithBaseSchema } from "./base.model";

let productSchema = new Schema<IProductModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  //userId: { type: String, required: true },
});

//productSchema.index({ userId: 1 }, { unique: true });
// productSchema.virtual("user", {
//   ref: "User",
//   localField: "userId",
//   foreignField: "_id",
//   justOne: true,
// });

productSchema = mergeWithBaseSchema(productSchema, true, true);

productSchema.pre("find", function (next) {
  this.where({
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
  });
  next();
});

productSchema.pre("findOne", function (next) {
  this.where({ deletedAt: { $exists: false } });
  next();
});

interface IProductPaginate
  extends IProductModel,
    PaginateModel<IProductModel>,
    AggregatePaginateModel<IProductModel> {}

const ProductModel = model<IProductModel, IProductPaginate>(
  "Product",
  productSchema
);

export default ProductModel;
