import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import userReducer from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";
import { adminAPI } from "./api/adminAPI";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [adminAPI.reducerPath]: adminAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer, // Add this line
    [userReducer.name]: userReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      userAPI.middleware,
      productAPI.middleware,
      adminAPI.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
