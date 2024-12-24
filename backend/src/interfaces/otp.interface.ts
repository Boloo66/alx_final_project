import { StringOrObjectId } from "../models/base.model";
import { IBaseModel } from "./model.interface";

export enum EOtpStatus {
  PENDING = "pending",
  USED = "used",
  CONFIRMED = "comfirmed",
}

export enum EOtpChannel {
  REGISTRATION = "registration",
  RESET = "reset",
}
export interface IOtpBase {
  userId: StringOrObjectId;
  channel: EOtpChannel;
  hashedCode: string;
  email: string;
}

export interface IOtp extends IOtpBase {
  expiresIn: Date;
  status: EOtpStatus;
}

export interface IOtpModel extends IOtp, IBaseModel {
  trial: number;
}
