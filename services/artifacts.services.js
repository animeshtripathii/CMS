import Artifacts from "../models/artifact.js";
import fs from "fs";
// FIX: Point this to the correct relative path of your cloudinary.js file
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
            // STEP 1: Upload the local file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: "cms-artifacts",
                resource_type: "auto" 
            });
            
            mediaUrl = uploadResult.secure_url;
            
            // STEP 2: DELETE the local file from /uploads after success
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            // Clean up local file even if Cloudinary fails
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error("Cloudinary Upload Failed: " + error.message);
        }
    }

    // STEP 3: Save the CLOUDINARY URL to MongoDB, not the local path
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