import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import getEnv from "../config/env.config";
import { IJwtPayload } from "../interfaces/util.interface";
import { createServiceError } from "./error.utils";

const { JWT_ADMIN_SECRET, JWT_SECRET } = getEnv();
export const verifyBearerToken = (
  token: string,
  secret: string,
  { verify = jwt.verify } = {}
) => {
  try {
    const decoded = verify(token.trim(), secret.trim()) as IJwtPayload;

    return decoded;
  } catch (error) {
    return null;
  }
};

export const signToken = (
  data: IJwtPayload,
  secret: string,
  { sign = jwt.sign } = {}
) => {
  // Clean the secret before signing
  const cleanSecret = secret.trim();
  return sign(data, cleanSecret, { expiresIn: data.expiresIn || "6h" });
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
