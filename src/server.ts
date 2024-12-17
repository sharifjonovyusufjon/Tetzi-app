import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    console.log("MongoDB connection succedd");
    const PORT = process.env.PORT ?? 7007;
  })
  .catch((err) => console.log("ERR on connection MongoDB", err));
