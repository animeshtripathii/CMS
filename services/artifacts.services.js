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
            // Phase 1: Local file ko cloud storage par transmit karein
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: "cms-artifacts",
                resource_type: "auto" 
            });
            
            mediaUrl = uploadResult.secure_url;
            
            // Phase 2: Upload safal hone par temporary local file hata lein
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            // Upload fail hone par local file cleanup ensure karein
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error("Cloudinary Upload Failed: " + error.message);
        }
    }

    // Phase 3: Local path ki jagah database mein cloud URL save karein
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