import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import getEnv from "../config/env.config";
import { IJwtPayload } from "../interfaces/util.interface";
import { createServiceError } from "./error.utils";

const { JWT_ADMIN_SECRET, JWT_SECRET } = getEnv();
export const verifyBearerToken = (
  token: string,
  { verify = jwt.verify, secret = JWT_SECRET } = {}
) => {
  try {
    return verify(token, secret) as IJwtPayload;
  } catch (error) {
    return null;
  }
};

export const signToken = (
  data: IJwtPayload,
  { sign = jwt.sign, secret = JWT_SECRET } = {}
) => {
  return sign(data, secret, { expiresIn: data.expiresIn || "6h" });
};

export const createHash = async (
  plainText: string,
  { hash = bcrypt.hash } = {}
) => {
  return await hash(plainText, 10);
};

export const compareHash = async (
  plainText: string,
  hash: string,
  { compare = bcrypt.compare } = {}
) => {
  return await compare(plainText, hash);
};

/**
 * @throws HASH_MISMATCH_ERROR
 * @param plainText
 * @param hash
 * @param param2
 */

export const ensureHashMatches = async (
  plainText: string,
  hash: string,
  { compare = compareHash, errMsg = "" } = {}
) => {
  const match = await compare(plainText, hash);

  if (!match) {
    throw createServiceError(errMsg || "Hash mismatch", "HASH_MISMATCH_ERROR");
  }
};
