import { Router } from "express";
import adminAuth from "./auth.routes";
import productRoute from "./product.routes";
import orderRouter from "./order.routes";

const adminRoutes = Router();

adminRoutes.use("/auth", adminAuth);
adminRoutes.use("/products", productRoute);
adminRoutes.use("/orders", orderRouter);

export default adminRoutes;
