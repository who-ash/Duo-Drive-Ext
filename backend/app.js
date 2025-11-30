import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /^chrome-extension:\/\/.+/,
      "https://duo-drive-ext.vercel.app",
      "https://duo.ash404.me",
      "https://duodrive-backend-production.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);

// Route declaration
import healthRouter from "./router/health.router.js";
import responseRouter from "./router/generate-response.router.js";

app.use("/api", healthRouter);
app.use("/api/v1", responseRouter);

export default app;
