import { NextFunction, Request, Response } from "express";
import { ICloudinaryFileResponse } from "../interfaces/media.interface";
import { StatusCodes } from "http-status-codes";

export const handleCloudinaryUpload =
  () => (req: Request, res: Response, _next: NextFunction) => {
    const { path, filename, encoding, mimetype } =
      req.file as ICloudinaryFileResponse;

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "File uploaded successfully",
      data: {
        path,
        filename,
        encoding,
        mimetype,
      },
    });
  };

export const handleUpload =
  () => (req: Request, res: Response, _next: NextFunction) => {
    const { path, filename, encoding, mimetype } =
      req.file as ICloudinaryFileResponse;

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "File uploaded successfully",
      data: {
        path,
        filename,
        encoding,
        mimetype,
      },
    });
  };
