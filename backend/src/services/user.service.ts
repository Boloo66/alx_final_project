import { UpdateQuery } from "mongoose";
import { EUserStatus, IUserBase } from "../interfaces/user.interface";
import { StringOrObjectId } from "../models/base.model";
import { UserModel } from "../models/user.model";
import { createServiceError } from "../utils/error.utils";

export const create = async (data: IUserBase, { User = UserModel } = {}) => {
  try {
    const user = await UserModel.create(data);

    return user.toObject();
  } catch (error) {
    if ((error as { code: number }).code === 11000) {
      throw createServiceError("Email taken already", "DUPLICATE_EMAIL_ERROR");
    }

    throw error;
  }
};

export const findById = async (
  id: StringOrObjectId,
  { User = UserModel } = {}
) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw createServiceError("User not found", "USER_NOT_FOUND_ERROR");
    }

    return user.toObject();
  } catch (error) {
    throw createServiceError((error as Error).message, "INTERNAL_SERVER_ERROR");
  }
};

export const findByEmail = async (email: string, { User = UserModel } = {}) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createServiceError("User not found", "USER_NOT_FOUND_ERROR");
    }

    return user.toObject();
  } catch (error) {
    throw createServiceError((error as Error).message, "INTERNAL_SERVER_ERROR");
  }
};

export const findByIdAndBlock = async (
  id: StringOrObjectId,
  { User = UserModel } = {}
) => {
  await User.findByIdAndUpdate(id, { $set: { status: EUserStatus.INACTIVE } });
};

export const updateById = async (
  id: StringOrObjectId,
  update: Partial<UpdateQuery<IUserBase>>,
  { User = UserModel } = {}
) => {
  await User.findByIdAndUpdate(id, { update });
};
