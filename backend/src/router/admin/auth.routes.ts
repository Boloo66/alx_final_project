import { Router } from "express";
import validateSchema from "../../request-schemas";
import * as authValidationSchema from "../../request-schemas/auth.schema";
import * as authController from "../../controllers/auth.controller";
import { ERole } from "../../interfaces/user.interface";
import { isActiveUser } from "../../middlewares/auth.middleware";

const adminAuth = Router();

adminAuth.post(
  "/register",
  validateSchema(authValidationSchema.registerUser, "body"),
  authController.handleRegisterUser(ERole.ADMIN)
);

adminAuth.post(
  "/login",
  validateSchema(authValidationSchema.loginSchema, "body"),
  isActiveUser(),
  authController.handleAdminLogin()
);

export default adminAuth;
