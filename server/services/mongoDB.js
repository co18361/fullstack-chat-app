import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const dbUrl = process.env.DB_URI;

export const connectApplicationDb = () => {
  if (dbUrl) {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // mongoose.set("useCreateIndex", true);
    // mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on("error", () => logger.error("MongoDB connection error", ""));
    db.once("open", () => {
      console.info("database connected>>?>?");
    });
  }
};
