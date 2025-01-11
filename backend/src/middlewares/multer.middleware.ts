import multer, { Multer } from "multer";
import path from "path";
import { createRequestError } from "../utils/error.utils";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import fs from "fs";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const uploadPath = path.resolve(__dirname, "../../");
    const resolvedPath = path.join(uploadPath, "uploads");

    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath);
    }
    if (!file) callback(new Error(`File ${file} not found`), "");
    return callback(null, resolvedPath);
  },
  filename(_req, file, callback) {
    if (!file) callback(new Error(`File ${file} not found`), "");
    const filename = path.parse(file.originalname);
    callback(null, `${Date.now()}.${filename.ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: { mimetype: string },
  callback: (error: Error | null, acceptFile?: boolean) => void
) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
  ];

  if (!allowedFileTypes.includes(file.mimetype))
    callback(createRequestError("File not found", "", StatusCodes.BAD_REQUEST));
  else callback(null, true);
};

const fileParser = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
}).single("image");

export default fileParser;
