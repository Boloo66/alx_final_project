import { IProduct } from "./types";

// In api-types.ts (or wherever MessageResponse is defined)
export type MessageResponse = {
  message?: string;
  user?: User;
  token?: string;
  error?: string;
};

// BackendResponse for simpler responses like registration
export interface BackendResponse {
  status: string;
  message: string;
}

// LoginResponse for responses that include user and token
export interface LoginResponse {
  status: string;
  message: string;
  data: UserData; // Assuming UserData contains the user details
}

export type UserData = {
  token: string;
  role: string;
  name: string;
  email: string;
  id: string;
  expiresIn?: string;
};

// The User type
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  token?: string;
};

export type ICreateProductResponse = {
  status: string;
  data: { product: IProduct; message: string };
};

export interface IGetAProductResponse {
  status: string;
  data: { product: IProduct };
}

export interface IGetCategoryResponse {
  status: string;
  data: { categories: string[] };
}

export interface IGetAllProductResponse {
  status: string;
  data: { product: IProduct[] };
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    prevPage: number;
    nextPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

export type TCustomError = {
  status: number;
  message: string;
};
