import "dotenv/config";
import app from "./app";
import getEnv from "./config/env.config";
import connectDB from "./config/database.config";
import logger from "./utils/logger.utils";

const { PORT: port } = getEnv();

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info("MongoDB connected");

      logger.info(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
