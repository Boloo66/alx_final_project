import { z } from "zod";
import { parseEnv } from "znv";
import { ENodeEnv } from "../interfaces/env.interface";

const getEnv = (env = process.env) =>
  parseEnv(env, {
    PORT: z.number().default(5050),
    MONGO_URI: z.string(),
    NODE_ENV: z
      .enum(Object.values(ENodeEnv) as any)
      .default(ENodeEnv.DEVELOPMENT),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
    JWT_ADMIN_SECRET: z.string(),
    FE_ADMIN_URL: z.string(),
    FE_CLIENT_URL: z.string(),
    EMAIL_NAME: z.string(),
    EMAIL: z.string(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.coerce.number().default(587),
  });

export default getEnv;
