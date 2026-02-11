import {togglelikeService} from "../services/like.services.js";
export const toggleLike = async (req, res) => { 
try{
    console.log("Toggling like for user:", req.user.id, "and artifact:", req.params.id);
    const result= await togglelikeService({userId:req.user.id, artifactId:req.params.id});
    console.log(result);
    res.status(200).json({
        success:true,
        message:result.liked ? "Artifact liked" : "Artifact unliked",
      ...result
    });
}
catch(error){
    res.status(400).json({
        success:false,
        message:error.message
    });
}
}