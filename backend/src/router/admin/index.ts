import { Router } from "express";
import adminAuth from "./auth.routes";

const adminRoutes = Router();

adminRoutes.use("/auth", adminAuth);

export default adminRoutes;
