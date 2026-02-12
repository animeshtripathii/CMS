import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import artifactRoutes from "./routes/artifact.route.js"
import likeRoutes from "./routes/like.route.js";
import { testingCron } from "./cron/testing.js";
import { archiveOldDraftsCron } from "./cron/archiveArtifacts.js";
import webhookRoutes from "./webhook/webhook.js";
import chatRouter from "./routes/chat.route.js"
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
const app = express();


archiveOldDraftsCron();

/* App Middleware ka Setup */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
/* API Status Check karna */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running"
  });
});
app.use("/chat",chatRouter)
app.use("/webhook",webhookRoutes);
app.use("/auth",authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likeRoutes);
export default app;





