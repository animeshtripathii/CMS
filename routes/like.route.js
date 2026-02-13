
import express from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes
 */

/**
 * @swagger
 * /likes/toggle/{id}:
 *   post:
 *     summary: Toggle like on an artifact
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artifact ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/toggle/:id", authMiddleware, toggleLike);

export default router;