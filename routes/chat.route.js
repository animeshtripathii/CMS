import express from 'express';
import { getChatByThread,sendChat } from '../controllers/chat.controller.js';
import {authMiddleware} from "../middleware/auth.middleware.js"
const router =express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for chat functionality
 */


/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               receiverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/",authMiddleware,sendChat);


/**
 * @swagger
 * /chat/{threadId}:
 *   get:
 *     summary: Get chat messages by thread ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Thread ID
 *     responses:
 *       200:
 *         description: Chat history retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/:threadId",authMiddleware,getChatByThread);


export default router;