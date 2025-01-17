import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BackendResponse, LoginResponse } from "../../types/api-types";
import { User } from "../../types/types";
import { TRootState } from "../store";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1`,
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
  endpoints: (builder) => ({
    register: builder.mutation<BackendResponse, User>({
      query: (user) => ({
        url: `/auth/register`,
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation<LoginResponse, User>({
      query: (user) => ({
        url: `/auth/login`,
        method: "POST",
        body: user,
      }),
    }),
    updateUser: builder.mutation<BackendResponse, { id: string; user: User }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateUserMutation } =
  userAPI;
