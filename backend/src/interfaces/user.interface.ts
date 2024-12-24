import { IBaseModel } from "./model.interface";

export interface IUserBase {
  name: string;
  email: string;
  password: string;
  role: ERole;
  status?: EUserStatus;
}

export interface IUser extends IUserBase {}

export interface IJwtUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export enum ERole {
  USER = "user",
  ADMIN = "admin",
}

export enum EUserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IUserModel extends IUser, IBaseModel {}

export type TReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};
