export type User = {
  name?: string;
  email: string;
  password?: string;
  phone?: string | null;
  photo?: string | null;
  role?: string;
  token?: string;
  status?: EStatus;
  id?: string;
};

export enum EStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  description?: string;
}

export interface IOrderResponse {
  status: string; // e.g., "success"
  metadata: {
    page: number; // Current page number
    limit: number; // Items per page
    totalDocs: number; // Total number of documents
    totalPages: number; // Total number of pages
    hasPrevPage: boolean; // If there's a previous page
    hasNextPage: boolean; // If there's a next page
  };
  data: {
    orders: Order[]; // Array of order objects
  };
}

export interface Order {
  id: string; // Order ID
  subtotal: number; // Subtotal amount
  total: number; // Total amount
  tax: number; // Tax amount
  discount: number; // Discount amount
  shippingfee: number; // Shipping fee
  orderItems: OrderItem[]; // Array of items in the order
  userId: string; // User ID who placed the order
  shippingDetails: ShippingDetails; // Shipping details
  name: string; // Name of the customer
  status: string; // Status of the order
}

export interface OrderItem {
  productId: string; // Product ID
  quantity: number; // Quantity of the product
  price: number; // Price of the product
  name?: string; // Product name
  image?: string; // Product image URL
}

export interface ShippingDetails {
  address: string; // Street address
  city: string; // City
  state: string; // State
  zip: string; // ZIP/Postal code
  country: string; // Country
}
