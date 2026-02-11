import Artifacts from "../models/artifact.js";
export const createArtifactService = async ({
    title, content, userId
})=>{
    if(!title || !content){
        throw new Error("Title and Content are required to create an artifact");
    }
    const artifact = await Artifacts.create({
        title,
        content,
        author: userId
    });
    return artifact;    
}

export const getArtifactsService = async (userData) => {
    if (userData.role === "VIEWER") {
        return await Artifacts.find({ author: userData.id }).populate("author", "username email");
    }
    return await Artifacts.find().populate("author", "username email");
}