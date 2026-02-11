import express from "express";
import {createArtifact} from "../controllers/artifact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/roles.middleware.js";
import {getArtifacts} from "../controllers/artifact.controller.js";


const router = express.Router();

router.post("/", authMiddleware,createArtifact);
router.get("/", authMiddleware, authorizeRoles("ADMIN","VIEWER"), getArtifacts);
export default router;