import { Router } from "express";
import userAuthRoutes from "./auth.routes";
import adminRoutes from "./admin";
import fileRouter from "./media.routes";
import orderRoute from "./order.routes";
import couponRoute from "./coupon.routes";
import paymentRouter from "./payment.routes";
import productRoute from "./product.routes";
const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/admin", adminRoutes);
router.use("/media", fileRouter);
router.use("/orders", orderRoute);
router.use("/coupons", couponRoute);
router.use("/payments", paymentRouter);
router.use("/products", productRoute);

export default router;
