import Artifacts from "../models/artifact.js";
import fs from "fs";
import cloudinary from '../config/cloudinary.js';

export const createArtifactService = async ({
    title, content, userId, filePath
}) => {
    if(!title || !content){
        throw new Error("Title and Content are required to create an artifact");
    }

    let mediaUrl = null;

    if (filePath) {
        try {
            // Phase 1: Transmit local file to cloud storage
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: "cms-artifacts",
                resource_type: "auto" 
            });
            
            mediaUrl = uploadResult.secure_url;
            
            // Phase 2: Remove temporary local file upon successful upload
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            // Ensure local file cleanup in case of upload failure
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error("Cloudinary Upload Failed: " + error.message);
        }
    }

    // Phase 3: Persist the cloud URL in the database instead of the local path
    const artifact = await Artifacts.create({
        title,
        content,
        author: userId,
        filePath: mediaUrl 
    });
   
    return artifact;    
};

export const getArtifactsService = async (userData) => {
    if (userData.role === "VIEWER") {
        return await Artifacts.find({ author: userData.id }).populate("author", "username email");
    }
    return await Artifacts.find().populate("author", "username email");
};