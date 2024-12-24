import { Router } from "express";
import validateSchema from "../../request-schemas";
import { registerUser } from "../../request-schemas/auth.schema";
import * as authController from "../../controllers/auth.controller";
import { ERole } from "../../interfaces/user.interface";

const adminAuth = Router();

adminAuth.post(
  "/register",
  validateSchema(registerUser, "body"),
  authController.handleRegisterUser(ERole.ADMIN)
);

export default adminAuth;
