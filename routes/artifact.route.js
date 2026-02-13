import express from "express";
import { createArtifact, getArtifacts } from "../controllers/artifact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/roles.middleware.js";
import { limiter } from "../middleware/rateLimiter.middleware.js";
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Artifacts
 *   description: API for managing artifacts
 */

/**
 * @swagger
 * /artifacts:
 *   post:
 *     summary: Create a new artifact
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artifact created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, upload.single("file"), createArtifact);

/**
 * @swagger
 * /artifacts:
 *   get:
 *     summary: Get all artifacts
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of artifacts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", limiter, authMiddleware, authorizeRoles("ADMIN", "VIEWER"),getArtifacts);

export default router;