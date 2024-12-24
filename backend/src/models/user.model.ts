import { AggregatePaginateModel, PaginateModel, model, Schema } from "mongoose";
import { ERole, EUserStatus, IUserModel } from "../interfaces/user.interface";
import { mergeWithBaseSchema } from "./base.model";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

let userSchema = new Schema<IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ERole, default: ERole.USER },
  status: { type: String, enum: EUserStatus, default: EUserStatus.INACTIVE },
});

userSchema = mergeWithBaseSchema(userSchema, true, true);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);

interface IPaginateModel
  extends PaginateModel<IUserModel>,
    AggregatePaginateModel<IUserModel> {}

export const UserModel = model<IUserModel, IPaginateModel>("User", userSchema);
