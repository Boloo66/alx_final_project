import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type OrderItem = {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  stock?: number;
  image?: string;
};

type ShippingDetails = {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type OrderState = {
  loading: boolean;
  subtotal: number;
  total: number | string;
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
  total: 0.0,
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
        const price = Number(item.price); // Convert price to number
        const quantity = Number(item.quantity); // Convert quantity to number
        if (isNaN(price) || isNaN(quantity)) {
          console.error("Invalid item price or quantity", item);
          return acc; // Skip invalid items
        }
        return acc + price * quantity;
      }, 0);

      state.subtotal = Number(subtotal.toFixed(2)); // Round to 2 decimal places

      // Shipping fee logic
      state.shippingfee = state.subtotal > 1000 ? 0 : 5;

      // Tax calculation
      state.tax = Number((state.subtotal * 0.12).toFixed(2)); // Round tax to 2 decimal places

      // Discount validation
      const discount =
        isNaN(Number(state.discount)) || state.discount < 0
          ? 0
          : Number((state.discount / 100) * state.subtotal);

      // Total price calculation
      const total = subtotal + state.tax + state.shippingfee - discount;

      state.total = Number(total.toFixed(2)); // Round to 2 decimal places
    },

    saveShippingInfo: (state, action: PayloadAction<ShippingDetails>) => {
      console.log("saving shipping info");
      state.shippingDetails = action.payload;
    },
    resetCart: (state) => initialState,
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
