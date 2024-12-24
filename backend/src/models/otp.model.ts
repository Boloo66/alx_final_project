import { model, Schema, Types } from "mongoose";
import {
  EOtpChannel,
  EOtpStatus,
  IOtpModel,
} from "../interfaces/otp.interface";
import { mergeWithBaseSchema } from "./base.model";

let tokenSchema = new Schema<IOtpModel>({
  userId: { type: Schema.Types.ObjectId, required: true },
  hashedCode: { type: String, required: true },
  expiresIn: { type: Date, required: true },
  channel: { type: String, enum: EOtpChannel, required: true },
  status: { type: String, enum: EOtpStatus, default: EOtpStatus.PENDING },
  email: { type: String, required: true },
  trial: { type: Number, default: 5 },
});

tokenSchema = mergeWithBaseSchema(tokenSchema);

tokenSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });

const TokenModel = model<IOtpModel>("Otp", tokenSchema);

export default TokenModel;
