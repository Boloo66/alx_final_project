import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BackendResponse, LoginResponse } from "../../types/api-types";
import { IOrderResponse, User } from "../../types/types";
import { TRootState } from "../store";

export const adminAPI = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/admin`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as TRootState;
      const token = state.userReducer.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("origin", "http://localhost:5173/");
      return headers;
    },
  }),
  tagTypes: ["orders", "users"],
  endpoints: (builder) => ({
    adminRegister: builder.mutation<BackendResponse, User>({
      query: (user) => ({
        url: `/auth/register`,
        method: "POST",
        body: user,
      }),
    }),
    adminLogin: builder.mutation<LoginResponse, User>({
      query: (user) => ({
        url: `/auth/login`,
        method: "POST",
        body: user,
      }),
    }),
    updateUser: builder.mutation<BackendResponse, { id: string; user: User }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
    myAdminOrders: builder.query<
      IOrderResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => {
        const queryString = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        }).toString();

        return {
          url: `/orders?${queryString}`,
        };
      },
    }),
    updateOrder: builder.mutation<
      UpdateResponse,
      { id: string; data: { status: string } }
    >({
      query: (i) => ({
        url: `/orders/${i.id}`,
        method: "PATCH",
        body: i.data,
      }),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation<UpdateResponse, { id: string }>({
      query: (i) => ({
        url: `/orders/${i.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminRegisterMutation,
  useUpdateUserMutation,
  useMyAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = adminAPI;

export type UpdateResponse = {
  status: string;
  data: {
    status: string;
  };
};
