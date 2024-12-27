import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import getEnv from "../config/env.config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { Request } from "express";
import { createRequestError } from "../utils/error.utils";
import { StatusCodes } from "http-status-codes";

const {
  CLOUDINARY_API_KEY: api_key,
  CLOUDINARY_CLOUD_NAME: cloud_name,
  CLOUDINARY_API_SECRET_KEY: api_secret,
} = getEnv();

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const uploadOptions = {
  folder: "ecommerce",
  public_id: (req: Request, file: { originalname: string }) => {
    const parsedFile = path.parse(file.originalname);
    return `${Date.now()}-${parsedFile.name}.${parsedFile.ext}`.trim();
  },
  resource_type: "raw",
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: uploadOptions,
});

const cloudinaryFileParser = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter(_req, file, callback) {
    if (!file)
      callback(
        createRequestError("File not found", "", StatusCodes.BAD_REQUEST)
      );

    const allowedExtensions = ["jpeg", "jpg", "pdf", "ico", "gif"];

    const allowedMimetypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/ico",
    ];

    const extname = allowedExtensions.includes(
      path.parse(file.originalname).ext.split(".")[1]
    );

    const fileType = allowedMimetypes.includes(file.mimetype.toString());

    if (extname && fileType) {
      callback(null, true);
    } else {
      callback(
        createRequestError(
          "File type not supported",
          "FILE_NOT_FOUND_ERROR",
          StatusCodes.UNPROCESSABLE_ENTITY
        )
      );
    }
  },
}).single("cloudinary-file");

export default cloudinaryFileParser;
