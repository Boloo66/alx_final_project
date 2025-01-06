import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { MessageResponse } from "../../types/api-types";
import { User } from "../../types/types";
import { RootState } from "../store";
import { Root } from "react-dom/client";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.userReducer.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("origin", "http://localhost:5173/");
      return headers;
      //   const {
      //     userAPI: { token },
      //   } = getState() as RootState;
      //   if (token) {
      //     headers.set("Authorization", `Bearer ${token}`);
      //   }
      //   return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<MessageResponse, User>({
      query: (user) => ({ url: `register`, method: "POST", body: user }),
    }),
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({ url: `login`, method: "POST", body: user }),
    }),
    updateUser: builder.mutation<MessageResponse, { id: string; user: User }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
  }),
});
