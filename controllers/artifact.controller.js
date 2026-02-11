import { createArtifactService, getArtifactsService } from "../services/artifacts.services.js";

export const createArtifact = async (req, res) => {
  try {
    const artifactData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
  
      filePath: req.file ? req.file.path : null 
    };

    const artifact = await createArtifactService(artifactData);

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

export const getArtifacts = async (req, res) => {
  try {
    const artifacts = await getArtifactsService(req.user);
    res.status(200).json({
      success: true,
      artifacts
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};