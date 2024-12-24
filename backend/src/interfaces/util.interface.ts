export interface IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  expiresIn?: `${number}h`;
}
