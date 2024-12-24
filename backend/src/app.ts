import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import logger from "./utils/logger.utils";
import router from "./router";
import {
  errorMiddleware,
  notFoundErrorMiddleware,
} from "./middlewares/error.middleware";

dotenv.config({ path: ".env" });

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
    referrerPolicy: { policy: "origin" },
    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },
    crossOriginResourcePolicy: { policy: "same-origin" },
  }),
  express.urlencoded({ extended: true, limit: "50mb" }),
  express.json({ limit: "50mb" }),
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.http(message.trim());
      },
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    serverHealth: "good",
    dbStatus: "ok",
    method: req.method,
  });
});

app.use("/api/v1", router);

app.use(notFoundErrorMiddleware);
app.use(errorMiddleware);

export default app;
