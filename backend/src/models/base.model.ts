import { Types } from "mongoose";
import { Schema, SchemaOptions, SchemaTypes } from "mongoose";

const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
  versionKey: false,
};

export function mergeWithBaseSchema(
  schema: Schema,
  paginate?: boolean,
  aggregatePaginate?: boolean,
  customSchemaOptions?: SchemaOptions
) {
  if (!schema.obj || Object.keys(schema.obj).length < 1) {
    throw new Error("Schema must contain at least one property");
  }

  if (paginate) {
    schema.plugin(require("mongoose-paginate-v2"));
  }

  if (aggregatePaginate) {
    schema.plugin(require("mongoose-aggregate-paginate-v2"));
  }

  return new Schema(
    {
      deletedAt: SchemaTypes.Date,
    },
    {
      ...defaultSchemaOptions,
      ...customSchemaOptions,
    }
  ).add(schema);
}

export const isValidObject = (id: string): boolean =>
  Types.ObjectId.isValid(id);

export type StringOrObjectId = string | Types.ObjectId;
