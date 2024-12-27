import { StringOrObjectId } from "../models/base.model";
import { IBaseModel } from "./model.interface";
import { IUserModel } from "./user.interface";

export interface IProductBase {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  userId: StringOrObjectId;
}

export interface IProduct extends IProductBase {}

export interface IProductModel extends IProduct, IBaseModel {
  user: IUserModel;
}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
}
