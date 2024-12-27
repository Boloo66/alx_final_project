import { Router } from "express";
import validateSchema from "../request-schemas";
import * as authValidationSchema from "../request-schemas/auth.schema";
import * as authController from "../controllers/auth.controller";
import { ERole } from "../interfaces/user.interface";
import { isActiveUser } from "../middlewares/auth.middleware";
const userAuthRoutes = Router();

userAuthRoutes.post(
  "/register",
  validateSchema(authValidationSchema.registerUser, "body"),
  authController.handleRegisterUser()
);

userAuthRoutes.post(
  "/login",
  validateSchema(authValidationSchema.loginSchema, "body"),
  isActiveUser(),
  authController.handleUserLogin()
);

userAuthRoutes.post(
  "/verify-code",
  validateSchema(authValidationSchema.verifyCodeSchema, "body"),
  authController.handleVerifyRegCode(true)
);

userAuthRoutes.get(
  "/complete-registration",
  validateSchema(authValidationSchema.completeRegSchema, "query"),
  authController.handleCompleteReg()
);

userAuthRoutes.post(
  "/forgot-password",
  validateSchema(authValidationSchema.forgetPasswordSchema, "body"),
  authController.handleForgotPassword()
);

userAuthRoutes.post(
  "/verify-reset-code",
  validateSchema(authValidationSchema.verifyCodeSchema, "body"),
  authController.handleVerifyRegCode(false)
);

userAuthRoutes.post(
  "/update-password",
  validateSchema(authValidationSchema.updatePasswordBodySchema, "body"),
  validateSchema(authValidationSchema.updatePasswordParamSchema, "params"),
  authController.handleUserResetPassword()
);

userAuthRoutes.post(
  "/request-reg-code",
  validateSchema(authValidationSchema.requestNewCodeSchema, "body"),
  authController.handleRequestNewCode(true)
);

userAuthRoutes.post(
  "/request-reset-code",
  validateSchema(authValidationSchema.requestNewCodeSchema, "body"),
  authController.handleRequestNewCode(true)
);

export default userAuthRoutes;
