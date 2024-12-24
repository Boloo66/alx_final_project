import { Router } from "express";
import validateSchema from "../request-schemas";
import { registerUser } from "../request-schemas/auth.schema";
import * as authController from "../controllers/auth.controller";
import { ERole } from "../interfaces/user.interface";
const userAuthRoutes = Router();

userAuthRoutes.post(
  "/register",
  validateSchema(registerUser, "body"),
  authController.handleRegisterUser()
);

export default userAuthRoutes;
