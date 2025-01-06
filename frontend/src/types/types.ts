export type User = {
  name?: string;
  email: string;
  password: string;
  phone?: string | null;
  photo?: string | null;
  role?: string;
  token?: string;
  isBanned?: boolean;
};
