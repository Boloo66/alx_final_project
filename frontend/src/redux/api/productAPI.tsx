import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ICreateProductResponse,
  IGetAllProductResponse,
  IGetAProductResponse,
  IGetCategoryResponse,
} from "../../types/api-types";
import { IProduct } from "../../types/types";
import { TRootState } from "../store";

export const productAPI = createApi({
  reducerPath: "productApi",
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
    searchProducts: builder.query<IGetAllProductResponse, TFetchPostsParams>({
      query: ({ page = 1, limit = 10, search, category, sort } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (sort) params.append("sort", sort);
        return `/admin/products?${params.toString()}`;
      },
    }),
    userSearchProducts: builder.query<
      IGetAllProductResponse,
      TFetchPostsParams
    >({
      query: ({ page = 1, limit = 10, search, category, sort } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (sort) params.append("sort", sort);
        return `/products?${params.toString()}`;
      },
    }),
    productById: builder.query<IGetAProductResponse, string>({
      query: (id) => `/admin/products/${id}`,
    }),
    getCategory: builder.query<IGetCategoryResponse, null>({
      query: () => `/admin/products/categories`,
    }),
    userGetCategory: builder.query<IGetCategoryResponse, null>({
      query: () => `/products/categories`,
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
        url: `/admin/products/${data.productId}`,
        method: "PATCH",
        body: data.formData,
      }),
    }),
    deleteProduct: builder.mutation<null, TDeleteResponse>({
      query: (data: TDeleteResponse) => ({
        url: `/admin/products/${data.productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

type TFetchPostsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
};

interface UpdateProductData {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images?: string[];
}

type TUpdateResponse = {
  productId: string;
  formData: UpdateProductData;
};

type TDeleteResponse = {
  productId: string;
};

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useNewProductMutation,
  useProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoryQuery,
  useSearchProductsQuery,
  useUserSearchProductsQuery,
  useUserGetCategoryQuery,
} = productAPI;
