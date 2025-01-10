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
