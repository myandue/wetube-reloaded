import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title:{type:String, required:true, trim: true, max:80,},
    description:{type:String, required:true, trim: true, min:20,},
    createdAt:{type:Date, default:Date.now,},
    hashtags:[{type:String, trim: true,}],
    meta:{
        views:{type:Number, default:0},
        rating:{type:Number, default:0},
    },
});

videoSchema.static("formatHashtags", function(hashtags){
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;