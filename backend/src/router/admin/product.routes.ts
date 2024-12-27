import { Router } from "express";
import { isAuthenticatedAdmin } from "../../middlewares/auth.middleware";
import validateSchema from "../../request-schemas";
import * as productSchema from "../../request-schemas/product.schema";
import * as productController from "../../controllers/product.controller";

const productRoute = Router();

productRoute.use(isAuthenticatedAdmin());

productRoute.post(
  "/",
  validateSchema(productSchema.createProductSchema, "body"),
  productController.handleCreate()
);

productRoute.patch(
  "/:id",
  validateSchema(productSchema.updateProductSchema, "body"),
  validateSchema(productSchema.getProductParamSchema, "params"),
  productController.handleUpdateProduct()
);

productRoute.get(
  "/",
  validateSchema(productSchema.getProductQuery, "query"),
  productController.handleListAllProducts()
);

productRoute.get("/categories", productController.handleListAllCategories());

productRoute.get(
  "/:id",
  validateSchema(productSchema.getProductParamSchema, "params"),
  productController.handleListByProductId()
);

productRoute.delete(
  "/:id",
  validateSchema(productSchema.getProductParamSchema, "params"),
  productController.handleDeleteProduct()
);

export default productRoute;
