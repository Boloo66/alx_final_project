import { NextFunction, Request, RequestHandler, Response } from "express";
import * as userService from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { createRequestError, createServiceError } from "../utils/error.utils";
import { ERole, EUserStatus } from "../interfaces/user.interface";
import * as hashUtils from "../utils/hash.utils";
import * as otpUtils from "../utils/otp.utils";
import * as otpService from "../services/otp.service";
import { IJwtPayload } from "../interfaces/util.interface";
import getEnv from "../config/env.config";
import { EOtpChannel, EOtpStatus, IOtpBase } from "../interfaces/otp.interface";
import loadHtmlTemplate from "../emails";
import generateFrontendUrl from "../utils";
import path from "path";
import { Mailer } from "../utils/mail.utils";
import { StringOrObjectId } from "../models/base.model";

export const handleRegisterUser =
  (
    role: ERole.USER | ERole.ADMIN = ERole.USER,
    {
      create = userService.create,
      hashUtil = hashUtils.createHash,
      generateOtp = otpUtils.generateRandomCode,
      createOtp = otpService.create,
      generateUrl = generateFrontendUrl,
      loadTemplate = loadHtmlTemplate,
    } = {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, redirectPath } = req.body;

      const { id } = await create({
        name,
        email,
        password: await hashUtil(password),
        role: role,
      });

      const otp = generateOtp();

      const otpData: IOtpBase = {
        email: email,
        userId: id,
        hashedCode: await hashUtil(otp),
        channel: EOtpChannel.REGISTRATION,
      };

      const { id: tokenId } = await createOtp(otpData);
      const emailEncoded = encodeURIComponent(email);

      const verificationUrl = generateUrl(
        `${redirectPath}?id=${tokenId}&code=${otp}&email=${emailEncoded}`
      );

      //import html and send
      const verificationEmailPath = path.resolve(
        __dirname,
        "../emails",
        "send-verification.html"
      );

      const html = await loadTemplate(verificationEmailPath, {
        name,
        verificationUrl,
      });

      const mailer = new Mailer();
      await mailer.SendMail(email, "Welcome to Our Store!", html);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "User created successfully",
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        DUPLICATE_EMAIL_ERROR: StatusCodes.CONFLICT,
      };

      next(
        createRequestError(
          (error as Error).message || "Internal Server",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleVerifyRegCode =
  (
    isRegistration: boolean = true,
    {
      getOtpById = otpService.findById,
      ensureStatusMatches = otpService.ensureStatusMatches,
      ensureNotExpired = otpService.ensureNotExpired,
      validateOtpCode = otpService.validateOtpCode,
      blockUserById = userService.findByIdAndBlock,
      updateOtpStatus = otpService.updateStatus,
    } = {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, code } = req.body;

    const channel = isRegistration
      ? EOtpChannel.REGISTRATION
      : EOtpChannel.RESET;

    try {
      const { hashedCode, email, userId, expiresIn, status } = await getOtpById(
        id,
        channel
      );

      ensureNotExpired(expiresIn);

      ensureStatusMatches(status, EOtpStatus.PENDING);

      const { status: _tokenStatus, blockUser } = await validateOtpCode(
        code,
        hashedCode,
        email
      );

      if (blockUser) {
        await blockUserById(userId);

        res.status(StatusCodes.FORBIDDEN).json({
          status: "error",
          sessionId: "",
          message:
            "User has been blocked due to too many failed login attempts",
        });
      }

      await updateOtpStatus(id, EOtpStatus.CONFIRMED);

      res.json({
        status: "success",
        sessionId: id,
        message: "Procees to complete registration",
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
        OTP_NOT_FOUND_ERROR: StatusCodes.PRECONDITION_FAILED,
        HASH_MISMATCH_ERROR: StatusCodes.PRECONDITION_FAILED,
        INVALID_TOKEN_ERROR: StatusCodes.PRECONDITION_FAILED,
        OTP_STATUS_MISMATCH_ERROR: StatusCodes.PRECONDITION_FAILED,
      };
      next(
        createRequestError(
          (error as Error).message || "Unable to verify user",
          (error as Error).name,
          errMap[(error as Error).name] || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };

export const handleCompleteReg =
  ({
    findOtpById = otpService.findById,
    markOtpAsUsed = otpService.updateStatus,
    verifyStatus = otpService.ensureStatusMatches,
    updateUser = userService.updateByEmail,
  } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.query.id as StringOrObjectId;

      const { status, email } = await findOtpById(id, EOtpChannel.REGISTRATION);

      verifyStatus(status, EOtpStatus.CONFIRMED);

      await markOtpAsUsed(id, EOtpStatus.USED);

      await updateUser(email, { status: EUserStatus.ACTIVE });

      res.json({
        status: "success",
        message: "Registration completed successfully",
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        OTP_NOT_FOUND_ERROR: StatusCodes.PRECONDITION_FAILED,
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
        OTP_STATUS_MISMATCH_ERROR: StatusCodes.PRECONDITION_FAILED,
      };
      next(
        createRequestError(
          (error as Error).message || "Session is invalid or expired",
          (error as Error).name,
          errMap[(error as Error).name] || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };

export const handleForgotPassword =
  ({
    findUserByEmail = userService.findByEmail,
    hashUtil = hashUtils.createHash,
    generateOtp = otpUtils.generateRandomCode,
    createOtp = otpService.create,
    generateUrl = generateFrontendUrl,
    loadTemplate = loadHtmlTemplate,
  } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email: emailIn, redirectPath } = req.body;

      const { id: userId, email, name } = await findUserByEmail(emailIn);

      const otp = generateOtp();

      const hashedCode = await hashUtil(otp);

      const otpData: IOtpBase = {
        userId,
        hashedCode,
        email,
        channel: EOtpChannel.RESET,
      };

      const { id } = await createOtp(otpData);

      const verificationUrl = generateUrl(
        `${redirectPath}?id=${id}?code=${otp}?email=${email}`
      );

      const resetTemplatePath = path.resolve(
        __dirname,
        "../emails",
        "reset-password.html"
      );

      await loadTemplate(resetTemplatePath, { verificationUrl, name });

      res.json({
        message: "Reset link sent successfully",
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        EMAIL_NOT_FOUND_ERROR: StatusCodes.PRECONDITION_FAILED,
      };
      next(
        createRequestError(
          (error as Error).message || "User not found",
          (error as Error).name,
          errMap[(error as Error).name] || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };

export const handleAdminLogin =
  ({
    findByEmail = userService.findByEmail,
    ensurePasswordMatch = hashUtils.ensureHashMatches,
    createToken = hashUtils.signToken,
  } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await findByEmail(email);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      if (user.role !== ERole.ADMIN)
        throw createServiceError("Not permitted", "NOT_AUTHORIZED_ERROR");

      // Ensure password matches
      await ensurePasswordMatch(password, user.password);

      // Prepare JWT payload
      const payload: IJwtPayload = {
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
        expiresIn: "24h",
      };

      // Get secret
      const { JWT_ADMIN_SECRET: secret } = getEnv();
      if (!secret) {
        throw new Error("JWT_ADMIN_SECRET is not set in environment variables");
      }

      // Create token
      const token = createToken(payload, secret);
      console.log(token);

      // Respond with success
      res.json({
        status: "success",
        message: "Logged in successfully",
        data: {
          token,
          role: user.role,
          expiresIn: payload.expiresIn,
          name: user.name,
          email,
          id: user.id,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        HASH_MISMATCH_ERROR: StatusCodes.PRECONDITION_FAILED,
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
        NOT_AUTHORIZED_ERROR: StatusCodes.FORBIDDEN,
      };
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name] || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };

export const handleUserLogin =
  ({
    findByEmail = userService.findByEmail,
    ensurePasswordMatch = hashUtils.ensureHashMatches,
    createToken = hashUtils.signToken,
  } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await findByEmail(email);

      await ensurePasswordMatch(password, user.password);

      if (user.role === ERole.ADMIN) {
        return res.status(403).json({
          status: "error",
          message: "Admins cannot log in through the user endpoint",
        });
      }

      const payload: IJwtPayload = {
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
        expiresIn: "24h",
      };
      const { JWT_SECRET: secret } = getEnv();

      const token = createToken(payload, secret);

      res.json({
        status: "success",
        message: "Logged in successfully",
        data: {
          token,
          role: user.role,
          expiresIn: payload.expiresIn,
          name: user.name,
          email,
          id: user.id,
        },
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        HASH_MISMATCH_ERROR: StatusCodes.PRECONDITION_FAILED,
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message,
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };

export const handleUserResetPassword =
  ({
    findOtpById = otpService.findById,
    markOtpAsUsed = otpService.updateStatus,
    updatePassword = userService.updateById,
    hashPassword = hashUtils.createHash,
    checkOtpStatus = otpService.ensureStatusMatches,
  } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetId: id } = req.params;
      const { password } = req.body;

      const otp = await findOtpById(id, EOtpChannel.RESET);

      checkOtpStatus(otp.status, EOtpStatus.CONFIRMED);

      const { id: otpId } = otp;
      await updatePassword(otp.userId, {
        $set: {
          password: await hashPassword(password),
        },
      });

      await markOtpAsUsed(otpId, EOtpStatus.USED);

      res.json({
        message: "Password reset successfully",
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        ADMIN_OTP_NOT_FOUND_ERROR: StatusCodes.PRECONDITION_FAILED,
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message || "Session is invalid or expired",
          (error as Error).name,
          errMap[(error as Error).name] || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };

export const handleRequestNewCode =
  (
    channelIsRegistration: boolean = true,
    {
      getUserByEmail = userService.findByEmail,
      createOtp = otpService.create,
      generateOtp = otpUtils.generateRandomCode,
      generateUrl = generateFrontendUrl,
      loademplate = loadHtmlTemplate,
      hashCode = hashUtils.createHash,
    } = {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, redirectPath } = req.body;

      const channel = channelIsRegistration
        ? EOtpChannel.REGISTRATION
        : EOtpChannel.RESET;

      const { id: userId, name } = await getUserByEmail(email);

      const code = generateOtp();

      const otpData: IOtpBase = {
        userId,
        channel,
        hashedCode: await hashCode(code),
        email,
      };

      const { id } = await createOtp(otpData);

      const verificationUrl = generateUrl(
        `${redirectPath}?id=${id}&code=${code}&email=${email}`
      );

      const templatePath = path.resolve(
        __dirname,
        "../emails",
        "reset-link.html"
      );

      const html = await loademplate(templatePath, {
        verificationUrl,
        channel,
        name,
      });

      const mailer = new Mailer();

      await mailer.SendMail(email, "New Code", html);

      res.json({
        message: "Verification link sent successfully",
      });
    } catch (error) {
      console.log(error);
      const errMap: Record<string, StatusCodes> = {
        USER_NOT_FOUND_ERROR: StatusCodes.NOT_FOUND,
      };
      next(
        createRequestError(
          (error as Error).message || "Cannot generate link",
          (error as Error).name,
          errMap[(error as Error).name]
        )
      );
    }
  };
