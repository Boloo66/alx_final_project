import { IJwtAdmin } from "../interfaces/admin.interface";
import { IJwtUser } from "../interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      jwtUser?: IJwtUser;
      jwtAdmin?: IJwtAdmin;
    }
  }
}
