import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    artifact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artifact",
        required: true
    },
    likeCount:{
        type:Number,
        default:0
    }
}, { timestamps: true });
likeSchema.index({ user: 1, artifact: 1 }, { unique: true });
const Like = mongoose.model("Like", likeSchema);
export default Like;