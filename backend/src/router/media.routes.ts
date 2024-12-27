import { Router } from "express";
import cloudinaryFileParser from "../middlewares/file.middleware";
import * as mediaController from "../controllers/media.controller";
import fileParser from "../middlewares/multer.middleware";

const fileRouter = Router();

fileRouter.post("/upload", fileParser, mediaController.handleUpload());

fileRouter.post(
  "/cloudinary-upload",
  cloudinaryFileParser,
  mediaController.handleCloudinaryUpload()
);

export default fileRouter;
