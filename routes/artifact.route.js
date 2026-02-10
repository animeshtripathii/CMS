import express from "express";
import {createArtifact} from "../controllers/artifact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
//import {aurthorizeRoles} from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", authMiddleware,createArtifact);
//router.get("/", authMiddleware, aurthorizeRoles("ADMIN"), getArtifacts);
export default router;