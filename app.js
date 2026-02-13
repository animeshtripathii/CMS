import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
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

/* Swagger Configuration */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS Backend API",
      version: "1.0.0",
      description: "API Documentation for CMS Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication API" },
      { name: "Artifacts", description: "API for managing artifacts" },
      { name: "Likes", description: "API for managing likes" },
      { name: "Chat", description: "API for chat functionality" },
      { name: "Webhook", description: "Webhook endpoints" },
    ],
  },
  apis: ["./app.js", "./routes/*.js", "./webhook/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check API status
 *     description: Returns the status of the CMS Backend API
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: CMS Backend is running
 */
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
app.use("/auth",authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likeRoutes);
app.use("/webhook",webhookRoutes);
app.use("/chat",chatRouter)
export default app;





