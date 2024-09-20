// import cookieParser from "cookie-parser";
// import express from "express";
// import cors from "cors";
// import errorHandler from "./utils/errorHandler.js";

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     secure: process.env.NODE_ENV === "production",
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());

// // Route import
// import userRouter from "./routes/user.routes.js";
// import rideRouter from "./routes/ride.routes.js";
// import messageRouter from "./routes/message.routes.js";
// import mapRouter from "./routes/map.routes.js";

// // Route declaration
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/ride", rideRouter);
// app.use("/api/v1/map", mapRouter);
// app.use("/api/v1/message", messageRouter);

// app.use(errorHandler);

// export { app };

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import errorHandler from "./utils/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow cookies
    methods: "GET,POST,PUT,DELETE", // Allowed methods
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Route import
import userRouter from "./routes/user.routes.js";
import rideRouter from "./routes/ride.routes.js";
import messageRouter from "./routes/message.routes.js";
import mapRouter from "./routes/map.routes.js";

// Route declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ride", rideRouter);
app.use("/api/v1/map", mapRouter);
app.use("/api/v1/message", messageRouter);

// Error handler
app.use(errorHandler);

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  // Wildcard route to serve index.html for frontend routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

export { app };
