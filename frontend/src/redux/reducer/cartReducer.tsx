import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type OrderItem = {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
};

type ShippingDetails = {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
};

export type OrderState = {
  loading: boolean;
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  shippingfee: number;
  orderItems: OrderItem[];
  shippingDetails: ShippingDetails;
  name: string;
};

const initialState: OrderState = {
  loading: false,
  subtotal: 0,
  total: 0,
  tax: 0,
  discount: 0,
  shippingfee: 10,
  orderItems: [],
  shippingDetails: {
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  name: "",
};

export type TCartItem = {
  productId: string;
  quantity: number;
  price?: number;
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      state.loading = true;
      const index = state.orderItems.findIndex(
        ({ productId }) => productId === action.payload.productId
      );

      if (index !== -1) {
        state.orderItems[index] = action.payload;
      } else {
        state.orderItems.push(action.payload);
      }
      state.loading = false;
    },
    removeCart: (state, action: PayloadAction<OrderItem>) => {
      state.loading = true;
      const index = state.orderItems.findIndex(
        ({ productId }) => productId === action.payload.productId
      );
      if (index !== -1) {
        state.orderItems.splice(index, 1);
      }
      state.loading = false;
    },
    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    calculatePrice: (state) => {
      const subtotal = state.orderItems.reduce((acc, item) => {
        return acc + item!.price * item.quantity;
      }, 0);
      state.subtotal = subtotal;
      state.shippingfee = state.subtotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subtotal) * 0.12;
      state.total = subtotal + state.tax + state.shippingfee - state.discount;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingDetails>) => {
      console.log("saving shipping info");
      state.shippingDetails = action.payload;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCart,
  calculatePrice,
  resetCart,
  saveShippingInfo,
  discountApplied,
} = cartReducer.actions;
