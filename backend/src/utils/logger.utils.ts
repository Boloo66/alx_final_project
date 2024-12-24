import { transports, format, config, createLogger } from "winston";
import getEnv from "../config/env.config";
import { ENodeEnv } from "../interfaces/env.interface";

const { cli, combine, errors, json, splat, timestamp } = format;

const { NODE_ENV } = getEnv();

const transportList = [];

if (NODE_ENV === "production") {
  transportList.push(new transports.Console());
} else {
  transportList.push(
    new transports.Console({
      format: combine(
        timestamp(),
        splat(),
        timestamp(),
        json(),
        errors({ stack: false })
      ),
    }),
    new transports.File({ filename: "error.log", level: "error" })
  );
}

const logger =
  NODE_ENV === ENodeEnv.TEST
    ? {
        error: () => {},
        info: () => {},
        warn: () => {},
        debug: () => {},
        http: () => {},
      }
    : createLogger({
        level: "http",
        levels: config.npm.levels,
        transports: transportList,
        format: combine(
          timestamp(),
          splat(),
          timestamp(),
          json(),
          errors({ stack: false })
        ),
      });

export default logger;
