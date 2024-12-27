import { Router } from "express";
import userAuthRoutes from "./auth.routes";
import adminRoutes from "./admin";
import fileRouter from "./media.routes";
import orderRoute from "./order.routes";
const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/admin", adminRoutes);
router.use("/media", fileRouter);
router.use("/orders", orderRoute);

export default router;
