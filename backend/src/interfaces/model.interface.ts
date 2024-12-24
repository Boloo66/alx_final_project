import { Types } from "mongoose";

export interface IBaseModel {
  _id: Types.ObjectId;
  id: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
