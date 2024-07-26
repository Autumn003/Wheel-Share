import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`⚙️ - Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection FAILED !! ", err);
  });
