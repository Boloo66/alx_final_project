import { Router } from "express";
import validateSchema from "../request-schemas";
import * as productSchema from "../request-schemas/product.schema";
import * as productController from "../controllers/product.controller";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";

const productRoute = Router();

productRoute.use(isAuthenticatedUser());

productRoute.get(
  "/",
  validateSchema(productSchema.getProductQuery, "query"),
  productController.handleListAllProducts()
);

productRoute.get("/categories", productController.handleListAllCategories());

export default productRoute;
