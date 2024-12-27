import { StringOrObjectId } from "../models/base.model";
import { IProductBase } from "./product.interface";
import { IUserBase } from "./user.interface";

export interface IShippingLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export enum EOrderStatus {
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export interface IOrderItem {
  productId: StringOrObjectId;
  quantity: number;
  price?: number;
  product?: IProductBase;
}

export interface IOrderBase {
  userId: StringOrObjectId;
  subtotal?: number;
  total?: number;
  tax: number;
  shippingLocation: IShippingLocation;
  orderItems: IOrderItem[];
  discount?: number;
  shippingfee: number;
}
export interface IOrderModel extends IOrderBase {
  product: IProductBase;
  status: EOrderStatus;
  user: IUserBase;
}
