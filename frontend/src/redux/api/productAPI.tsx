import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ICreateProductResponse,
  IGetAllProductResponse,
  IGetAProductResponse,
} from "../../types/api-types";
import { IProduct } from "../../types/types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      // Get auth data from localStorage
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).token : null;

      if (token) {
        // Remove any quotes and set the token
        const cleanToken = token.replace(/^"|"$/g, "");
        headers.set("authorization", `Bearer ${cleanToken}`);
        console.log("Clean token being sent:", cleanToken); // For debugging
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<IGetAllProductResponse, TFetchPostsParams>({
      query: ({ page, limit } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        return `/products?${params.toString()}`;
      },
    }),
    allProducts: builder.query<IGetAllProductResponse, TFetchPostsParams>({
      query: ({ page, limit } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        return `/admin/products?${params.toString()}`;
      },
    }),
    productById: builder.query<IGetAProductResponse, string>({
      query: (id) => `/products/${id}`,
    }),
    newProduct: builder.mutation<ICreateProductResponse, IProduct>({
      query: (formData: IProduct) => ({
        url: "/admin/products",
        method: "POST",
        body: formData,
      }),
    }),
    updateProduct: builder.mutation<ICreateProductResponse, TUpdateResponse>({
      query: (data: TUpdateResponse) => ({
        url: `/products/${data.productId}`,
        method: "PUT",
        body: data.formData,
      }),
    }),
  }),
});

type TFetchPostsParams = {
  page?: number;
  limit?: number;
};

type TUpdateResponse = { productId: string; formData: FormData };

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useNewProductMutation,
  useProductByIdQuery,
} = productAPI;
