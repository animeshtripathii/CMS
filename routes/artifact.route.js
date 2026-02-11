import express from "express";
import { createArtifact, getArtifacts } from "../controllers/artifact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/roles.middleware.js";
import { limiter } from "../middleware/rateLimiter.middleware.js";
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), createArtifact);
router.get("/", limiter, authMiddleware, authorizeRoles("ADMIN", "VIEWER"),getArtifacts);

export default router;