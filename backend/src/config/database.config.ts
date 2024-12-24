import getEnv from "./env.config";
import mongoose from "mongoose";

const { MONGO_URI, DB_NAME } = getEnv();

const connectDB = async (dbURI = MONGO_URI) => {
  await mongoose.connect(dbURI, {
    dbName: DB_NAME || "ecommerce",
  });
};

export const disconnect = async () => {
  await mongoose.connection.close();
};

export const dropDB = async () => {
  mongoose.connection.dropDatabase();
};

export default connectDB;
