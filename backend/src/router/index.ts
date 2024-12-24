import { Router } from "express";
import userAuthRoutes from "./auth.routes";
import adminRoutes from "./admin";

const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/admin", adminRoutes);

export default router;
