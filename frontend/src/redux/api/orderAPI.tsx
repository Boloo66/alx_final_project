import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TRootState } from "../store";
import { IOrderResponse } from "../../types/types";

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as TRootState;
      const token = state.userReducer.token;

      if (token) {
        const cleanToken = token.replace(/^"|"$/g, "");
        headers.set("authorization", `Bearer ${cleanToken}`);
      }

      headers.set("Content-Type", "application/json");
      headers.set("origin", "http://localhost:5173/");

      return headers;
    },
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponseData, OrderResponse>({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    myOrders: builder.query<IOrderResponse, string | undefined>({
      query: (id) => ({
        url: `orders/user/${id}`,
        method: "GET",
      }),
    }),
    adminOrders: builder.query<OrderResponseData, string>({
      query: (id) => ({
        url: `/orders?id=${id}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
  }),
});

interface Product {
  _id: string;
  name: string;
  price: number;
  id: string;
}

interface OrderItemResponse {
  productId: string;
  quantity: number;
  price: number | null;
  product?: Product;
}

interface ShippingLocationResponse {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export interface OrderResponse {
  deletedAt?: string | null;
  _id?: string;
  userId?: string;
  subtotal: number;
  total: number;
  tax: number;
  shippingfee: number;
  shippingLocation: ShippingLocationResponse;
  orderItems: OrderItemResponse[];
  discount: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  name?: string;
  image?: string;
}

interface OrderResponseData {
  status: string;
  data: {
    order: OrderResponse;
  };
}

export const { useCreateOrderMutation, useMyOrdersQuery, useAdminOrdersQuery } =
  orderAPI;
