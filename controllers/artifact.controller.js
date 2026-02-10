import { createArtifactService} from "../services/artifacts.services.js";

export const createArtifact = async (req, res) => {
  try {
 const artifact=await createArtifactService({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
 });
    res.status(201).json({
        success: true,
        message: "Artifact created successfully",
        artifact
    });
  } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    });
  }
};