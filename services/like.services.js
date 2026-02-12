import Like from "../models/likes.js";
export const togglelikeService=async({userId,artifactId})=>{
    try{
        const existingLike= await Like.findOne({user:userId, artifact:artifactId});
        if(existingLike){
            await existingLike.deleteOne();
            return {liked:false};
        }
        else{
        const newLike= await Like.create({user:userId, artifact:artifactId, likeCount:1});
    
        
        const likeCount= await Like.countDocuments({artifact:artifactId});
        await Like.updateMany({artifact:artifactId}, {likeCount:likeCount});
        
        return {liked:true, likeId:newLike._id, likeCount:likeCount};
        }
    }
    catch(error){
        return {liked:false, error:error.message};
    }
}
