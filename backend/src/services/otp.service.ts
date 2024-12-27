import { addMinutes } from "date-fns";
import { EOtpChannel, EOtpStatus, IOtpBase } from "../interfaces/otp.interface";
import TokenModel from "../models/otp.model";
import { StringOrObjectId } from "../models/base.model";
import { createServiceError } from "../utils/error.utils";
import * as hashUtils from "../utils/hash.utils";

export const create = async (
  data: IOtpBase,
  ttl = 30,
  { Otp = TokenModel } = {}
) => {
  const now = new Date();

  const payload = {
    ...data,
    expiresIn: addMinutes(now, ttl),
  };

  const [otp] = await Otp.create([payload]);

  return otp.toObject();
};

export const findById = async (
  id: StringOrObjectId,
  channel?: EOtpChannel,
  { Otp = TokenModel } = {}
) => {
  const error = createServiceError("Otp not found", "OTP_NOT_FOUND_ERROR");

  const otp = await Otp.findOne({
    _id: id,
    ...(channel && { channel }),
  }).orFail(error);

  return otp.toObject();
};

export const findByEmail = async (
  id: StringOrObjectId,
  { Otp = TokenModel }
) => {
  const error = createServiceError("Otp not found", "OTP_NOT_FOUND_ERROR");

  const otp = await Otp.findById(id, {}, { sort: { createdAt: -1 } }).orFail(
    error
  );

  return otp?.toObject();
};

export const ensureNotExpired = (expiresIn: Date) => {
  if (expiresIn < new Date()) {
    throw createServiceError("Otp session has expired", "OTP_EXPIRED_ERROR");
  }
};

export const ensureStatusMatches = (
  otpstatus: EOtpStatus,
  status: EOtpStatus
) => {
  if (otpstatus !== status) {
    throw createServiceError("", "OTP_STATUS_MISMATCH_ERROR");
  }
};

/**
 * @throws OTP_NOT_FOUND_ERROR
 */
export const updateStatus = async (
  id: StringOrObjectId,
  status: EOtpStatus,
  { Otp = TokenModel } = {}
) => {
  const otp = await Otp.findOneAndUpdate(
    {
      _id: id,
    },
    { status },
    { new: true }
  );

  if (!otp) {
    throw createServiceError("", "OTP_NOT_FOUND_ERROR");
  }

  return otp.toObject();
};

export const ensureHashMatches = async (
  plainText: string,
  hashedCode: string,
  email: string,
  remainingTrial?: number,

  { verifyHash = hashUtils.compareHash, Otp = TokenModel } = {}
) => {
  const isValid = await verifyHash(plainText, hashedCode);

  if (!isValid) {
    if (remainingTrial !== undefined) {
      const { trial: recentTrialCount } = await Otp.findByIdAndUpdate(
        { email, hashedCode },
        { $inc: { trial: -1 } },
        { sort: { createdAt: -1, new: true } }
      ).orFail(createServiceError("", "INVALID_TOKEN_ERROR"));

      if (recentTrialCount < 0) {
        throw createServiceError("Invalid token", "INVALID_TOKEN_ERROR");
      } else if (recentTrialCount < 1) {
        return {
          status: false,
          blockUser: true,
        };
      }
      throw createServiceError(
        `You have ${recentTrialCount} trials left`,
        "INVALID_TOKEN_ERROR"
      );
    }
    throw createServiceError("Invalid OTP", "INVALID_TOKEN_ERROR");
  } else {
    return {
      blockUser: false,
      status: true,
    };
  }
};

export const validateOtpCode = async (
  plainText: string,
  hashedCode: string,
  email: string,
  remainingTrial?: number,
  { verifyHash = hashUtils.compareHash, Otp = TokenModel } = {}
) => {
  const isValid = await verifyHash(plainText, hashedCode);

  if (isValid) {
    return {
      status: true,
      blockUser: false,
    };
  }

  if (remainingTrial !== undefined) {
    const { trial: recentTrialCount } = await Otp.findByIdAndUpdate(
      { email, hashedCode },
      { $inc: { trial: -1 } },
      { sort: { createdAt: -1, new: true } }
    ).orFail(createServiceError("Token not found", "INVALID_TOKEN_ERROR"));

    if (recentTrialCount < 1) {
      return {
        status: false,
        blockUser: true,
      };
    }

    throw createServiceError(
      `Invalid token. You have ${recentTrialCount} trial(s) left.`,
      "INVALID_TOKEN_ERROR"
    );
  }

  throw createServiceError("Invalid token.", "INVALID_TOKEN_ERROR");
};
